#!/usr/bin/env pwsh

Write-Host "🚀 LGA Data Ingestion Script" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the frontend directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing required dependencies..." -ForegroundColor Yellow
npm install csv-parser
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "💾 Running LGA data ingestion..." -ForegroundColor Yellow

# Run the ingestion script
node server/scripts/ingest-lga-data.mjs

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 LGA data ingestion completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your backend server" -ForegroundColor White
    Write-Host "2. Test the LGA dropdown in the frontend" -ForegroundColor White
    Write-Host "3. Verify all 21 LGAs are now available" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ LGA data ingestion failed. Check the error messages above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
