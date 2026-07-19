# Skrip build dan deploy dari mesin Windows. Bahasa: PowerShell.
param([string]$Tag = "latest")

Set-Location "$PSScriptRoot\..\..\frontend-federation\app-shell"
npm run build
Write-Host "Build selesai. Image tag: perpus/app-shell:$Tag"
