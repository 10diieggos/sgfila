param(
  [string]$OutputRoot = "$(Join-Path $PWD 'build')",
  [string]$NodeRuntimePath = "",
  [string]$NodeMuslPath = ""  # compatibilidade retroativa
)
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$serverSrc = Join-Path $repoRoot 'v3\server'
$clientSrc = Join-Path $repoRoot 'v3\client'
$out = Join-Path $OutputRoot 'SGFila'
New-Item -ItemType Directory -Force -Path $out | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $out '_logs') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $out '_builds') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $out '_estatisticas') | Out-Null
$serverOut = Join-Path $out 'server'
$clientOut = Join-Path $out 'client'
New-Item -ItemType Directory -Force -Path (Join-Path $serverOut 'dist') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $serverOut 'node_modules') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $serverOut 'scripts') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $serverOut '_runtime\node') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $clientOut 'dist') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $clientOut 'public\models') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $clientOut 'public\onnxruntime-web') | Out-Null
if (Test-Path (Join-Path $serverSrc 'dist')) { robocopy (Join-Path $serverSrc 'dist') (Join-Path $serverOut 'dist') /e /njh /njs /ndl /nc /ns /np | Out-Null }
if (Test-Path (Join-Path $serverSrc 'node_modules')) { robocopy (Join-Path $serverSrc 'node_modules') (Join-Path $serverOut 'node_modules') /e /njh /njs /ndl /nc /ns /np | Out-Null }
if (Test-Path (Join-Path $serverSrc 'scripts\start-sgfila.sh')) { Copy-Item (Join-Path $serverSrc 'scripts\start-sgfila.sh') (Join-Path $serverOut 'scripts\start-sgfila.sh') -Force }
if (Test-Path (Join-Path $clientSrc 'dist')) { robocopy (Join-Path $clientSrc 'dist') (Join-Path $clientOut 'dist') /e /njh /njs /ndl /nc /ns /np | Out-Null }
if (Test-Path (Join-Path $clientSrc 'public\models')) { robocopy (Join-Path $clientSrc 'public\models') (Join-Path $clientOut 'public\models') /e /njh /njs /ndl /nc /ns /np | Out-Null }
if (Test-Path (Join-Path $clientSrc 'public\onnxruntime-web')) { robocopy (Join-Path $clientSrc 'public\onnxruntime-web') (Join-Path $clientOut 'public\onnxruntime-web') /e /njh /njs /ndl /nc /ns /np | Out-Null }
if ([string]::IsNullOrWhiteSpace($NodeRuntimePath)) { $NodeRuntimePath = $NodeMuslPath }
if ($NodeRuntimePath -and (Test-Path $NodeRuntimePath)) { robocopy $NodeRuntimePath (Join-Path $serverOut '_runtime\node') /e /njh /njs /ndl /nc /ns /np | Out-Null }
$pathsToHash = @()
if (Test-Path (Join-Path $serverOut 'dist')) { $pathsToHash += (Join-Path $serverOut 'dist') }
if (Test-Path (Join-Path $clientOut 'dist')) { $pathsToHash += (Join-Path $clientOut 'dist') }
if (Test-Path (Join-Path $serverOut '_runtime\node')) { $pathsToHash += (Join-Path $serverOut '_runtime\node') }
if (Test-Path (Join-Path $clientOut 'public\models')) { $pathsToHash += (Join-Path $clientOut 'public\models') }
if (Test-Path (Join-Path $clientOut 'public\onnxruntime-web')) { $pathsToHash += (Join-Path $clientOut 'public\onnxruntime-web') }
$checksumFile = Join-Path $out '_builds\checksums.txt'
Remove-Item -ErrorAction SilentlyContinue $checksumFile
New-Item -ItemType File -Force -Path $checksumFile | Out-Null
foreach ($p in $pathsToHash) {
  Get-ChildItem -Recurse -File $p | ForEach-Object {
    $h = Get-FileHash -Algorithm SHA256 $_.FullName
    $rel = $_.FullName.Replace($out, '').TrimStart('\\')
    "$($h.Hash) `t $rel" | Add-Content -Path $checksumFile
  }
}
Write-Host "Pacote gerado em: $out"
Write-Host "Checksums: $checksumFile"
