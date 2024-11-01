# Target deployment directory
$targetDir = "E:\web\DiscordSummarizer"

# Create target directory if it doesn't exist
if (!(Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
    Write-Host "Created target directory: $targetDir"
}

# Files and directories to copy
$items = @(
    "index.html",
    "css",
    "js"
)

# Copy each item
foreach ($item in $items) {
    $source = Join-Path $PSScriptRoot $item
    $destination = Join-Path $targetDir $item
    
    if (Test-Path -Path $source) {
        if (Test-Path -Path $destination) {
            Remove-Item -Path $destination -Recurse -Force
            Write-Host "Removed existing: $destination"
        }
        
        if (Test-Path -Path $source -PathType Container) {
            Copy-Item -Path $source -Destination $destination -Recurse
            Write-Host "Copied directory: $item"
        } else {
            Copy-Item -Path $source -Destination $destination
            Write-Host "Copied file: $item"
        }
    } else {
        Write-Host "Warning: Source not found: $item"
    }
}

Write-Host "`nDeployment completed successfully!"

# Open the website in default browser
Start-Process "https://etdofresh.synology.me/DiscordSummarizer/"
Write-Host "Opening website in browser..."
