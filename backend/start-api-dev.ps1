Set-Location $PSScriptRoot
Set-Location ".\GodGraceHomeProducts.API"

$port = 5142
$connection = netstat -ano | Select-String ":$port"

if ($connection) {
    $parts = ($connection[0].ToString() -split '\s+') | Where-Object { $_ -ne '' }
    $processId = $parts[-1]

    if ($processId -match '^\d+$') {
        Write-Host "Port $port is already in use by PID $processId. Stopping existing process..."
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

Write-Host "Starting GodGraceHomeProducts API on http://localhost:$port ..."
dotnet run
