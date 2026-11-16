#requires -Version 5.1
<#
  Forwarding shim. The real script is versioned in the clone at
  `.agents/tools/sync.ps1`; this file exists so the documented command and any
  existing habits keep working after the move.

  All arguments pass through, so `-Check` behaves the same here.
#>

$real = Join-Path $HOME '.claude\agent-bootstrap\.agents\tools\sync.ps1'

if (-not (Test-Path -LiteralPath $real)) {
    throw "Expected the sync script at $real but it is missing. The clone is absent or incomplete: gh repo clone jakhall/agent-bootstrap `"$HOME\.claude\agent-bootstrap`""
}

& $real @args
