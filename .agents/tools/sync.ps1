#requires -Version 5.1
<#
  sync.ps1

  Pull the agent-bootstrap clone and regenerate the global `ab-*` native skill
  wrappers in ~/.claude/skills so they match the skills currently in the clone.

  Claude Code discovers skills by scanning ~/.claude/skills and needs YAML
  frontmatter with a name and description to decide when one triggers. The repo
  stores workflows as tool-agnostic markdown under .agents/skills, so this script
  generates the former from the latter. Each wrapper's body points at the absolute
  path of the real doc rather than copying it, so editing a skill's instructions
  takes effect immediately; only a `description` change needs a regenerate.

  Normal entry point (a shim at that path forwards here):
      powershell -NoProfile -File "$HOME\.claude\agent-bootstrap-sync.ps1"

  Check for drift without changing anything (no network, no writes; exits 1 if
  any wrapper is out of date). Used by the SessionStart hook:
      powershell -NoProfile -File "$HOME\.claude\agent-bootstrap-sync.ps1" -Check

  Each skill's `name`, `description` and optional `manual-only` come from YAML
  frontmatter in its SKILL.md. Frontmatter is the single source of truth: a skill
  with missing or invalid frontmatter is a hard error, because a silently empty
  description produces a wrapper the model can never trigger.

  Safe + idempotent. Only ever touches directories named `ab-*` under ~/.claude/skills.
#>

[CmdletBinding()]
param(
    # Report drift and exit non-zero instead of pulling or writing anything.
    [switch]$Check
)

$ErrorActionPreference = 'Stop'

# --- config ---
$ClaudeDir  = Join-Path $HOME '.claude'
$Clone      = Join-Path $ClaudeDir 'agent-bootstrap'
$SkillsSrc  = Join-Path $Clone '.agents\skills'
$SkillsDst  = Join-Path $ClaudeDir 'skills'
$Prefix     = 'ab-'
$MaxDesc    = 1536   # harness default for skillListingMaxDescChars
$Shim       = Join-Path $ClaudeDir 'agent-bootstrap-sync.ps1'

if (-not (Test-Path -LiteralPath $SkillsSrc)) {
    throw "Clone not found at $Clone. Clone it first: gh repo clone jakhall/agent-bootstrap `"$Clone`""
}

# --- helpers ---
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Convert-YamlScalar([string]$Value) {
    $v = $Value.Trim()
    if ($v.Length -ge 2 -and $v.StartsWith('"') -and $v.EndsWith('"')) {
        $inner = $v.Substring(1, $v.Length - 2)
        return $inner.Replace('\"', '"').Replace('\\', '\')
    }
    if ($v.Length -ge 2 -and $v.StartsWith("'") -and $v.EndsWith("'")) {
        return $v.Substring(1, $v.Length - 2).Replace("''", "'")
    }
    return $v
}

function Get-SkillFrontmatter([string]$Path, [string]$ExpectedName) {
    $lines = @(Get-Content -LiteralPath $Path -Encoding UTF8)

    # Locate the opening delimiter. Frontmatter must be the first thing in the file;
    # anything else means the skill was authored without it.
    $start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Trim() -eq '') { continue }
        if ($lines[$i].Trim() -eq '---') { $start = $i }
        break
    }
    if ($start -lt 0) {
        throw "$Path : missing YAML frontmatter. Add a '---' block with name and description as the first content in the file."
    }

    $end = -1
    for ($i = $start + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Trim() -eq '---') { $end = $i; break }
    }
    if ($end -lt 0) {
        throw "$Path : frontmatter opened with '---' but never closed."
    }

    $fm = @{}
    for ($i = $start + 1; $i -lt $end; $i++) {
        $line = $lines[$i]
        if (-not $line.Trim()) { continue }
        if ($line -match '^\s*#') { continue }
        if ($line -notmatch '^\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$') {
            throw "$Path : cannot parse frontmatter line $($i + 1): '$line'"
        }
        $fm[$Matches[1].ToLower()] = Convert-YamlScalar $Matches[2]
    }

    foreach ($required in @('name', 'description')) {
        if (-not $fm.ContainsKey($required) -or -not $fm[$required]) {
            throw "$Path : frontmatter is missing a non-empty '$required'."
        }
    }
    if ($fm['name'] -ne $ExpectedName) {
        throw "$Path : frontmatter name '$($fm['name'])' does not match its folder '$ExpectedName'."
    }

    $desc = ($fm['description'] -replace '\s+', ' ').Trim()
    if ($desc.Length -gt $MaxDesc) {
        Write-Warning "$ExpectedName : description is $($desc.Length) chars, over the $MaxDesc limit; truncating. Shorten it in the source file."
        $desc = $desc.Substring(0, $MaxDesc - 3).TrimEnd() + '...'
    }

    $manual = $false
    if ($fm.ContainsKey('manual-only')) {
        $manual = @('true', 'yes', '1') -contains $fm['manual-only'].ToLower()
    }

    return [pscustomobject]@{ Name = $fm['name']; Description = $desc; ManualOnly = $manual }
}

function ConvertTo-YamlDoubleQuoted([string]$s) {
    return '"' + $s.Replace('\', '\\').Replace('"', '\"') + '"'
}

$bodyTemplate = @'
Read and follow the authoritative workflow at:
`__SRC__`

Paths inside it: `.agents/skills/` and `.agents/standards/` are in the global clone
(`~/.claude/agent-bootstrap/.agents/`). `.agents/project/` means the CURRENT working repo's
`.agents/project/` folder.
'@

function Build-WrapperContent($Meta, [string]$WrapperName, [string]$SrcDoc) {
    $fm = "---`nname: $WrapperName`ndescription: " + (ConvertTo-YamlDoubleQuoted $Meta.Description)
    if ($Meta.ManualOnly) { $fm += "`ndisable-model-invocation: true" }
    $fm += "`n---`n"
    return $fm + "`n" + $bodyTemplate.Replace('__SRC__', $SrcDoc) + "`n"
}

# --- 1. pull latest (skipped in -Check: must stay read-only and offline) ---
if (-not $Check) {
    Write-Host "==> git pull ($Clone)"
    try { git -C $Clone pull --ff-only }
    catch { Write-Warning "git pull failed; regenerating wrappers from current clone contents anyway." }
}

# --- 2. build the desired state from source frontmatter ---
$srcDirs = Get-ChildItem -LiteralPath $SkillsSrc -Directory |
           Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') } |
           Sort-Object Name

$desired = @{}
foreach ($s in $srcDirs) {
    $srcDoc      = Join-Path $s.FullName 'SKILL.md'
    $wrapperName = "$Prefix$($s.Name)"
    $meta        = Get-SkillFrontmatter $srcDoc $s.Name
    $desired[$wrapperName] = @{
        Content    = Build-WrapperContent $meta $wrapperName $srcDoc
        ManualOnly = $meta.ManualOnly
    }
}

$staleWrappers = @(
    Get-ChildItem -LiteralPath $SkillsDst -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "$Prefix*" -and -not $desired.ContainsKey($_.Name) } |
        ForEach-Object { $_.Name }
)

# --- 3a. check mode: report drift, change nothing ---
if ($Check) {
    $drift = New-Object System.Collections.Generic.List[string]
    foreach ($name in ($desired.Keys | Sort-Object)) {
        $path = Join-Path (Join-Path $SkillsDst $name) 'SKILL.md'
        if (-not (Test-Path -LiteralPath $path)) {
            $drift.Add("missing wrapper: $name")
            continue
        }
        $onDisk = [System.IO.File]::ReadAllText($path)
        if ($onDisk -ne $desired[$name].Content) { $drift.Add("out of date: $name") }
    }
    foreach ($name in $staleWrappers) { $drift.Add("stale wrapper (source gone): $name") }

    if ($drift.Count -eq 0) {
        Write-Host "ab-* wrappers are in sync ($($desired.Count) skills)."
        exit 0
    }
    Write-Host "ab-* wrappers are OUT OF SYNC with the clone:"
    foreach ($d in $drift) { Write-Host "  - $d" }
    Write-Host "Fix: powershell -NoProfile -File `"$Shim`""
    exit 1
}

# --- 3b. write mode ---
foreach ($name in ($desired.Keys | Sort-Object)) {
    $dstDir = Join-Path $SkillsDst $name
    New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $dstDir 'SKILL.md'), $desired[$name].Content, $utf8NoBom)

    if ($desired[$name].ManualOnly) { $flag = ' [manual-only]' } else { $flag = '' }
    Write-Host ("  wrote {0}{1}" -f $name, $flag)
}

foreach ($name in $staleWrappers) {
    Remove-Item -LiteralPath (Join-Path $SkillsDst $name) -Recurse -Force
    Write-Host "  removed stale $name"
}

Write-Host ("==> done: {0} skill(s) synced under {1}" -f $desired.Count, $SkillsDst)
