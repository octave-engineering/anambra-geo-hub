@echo off
echo Installing required dependencies...
npm install csv-parser

echo.
echo Running LGA data ingestion...
node server/scripts/ingest-lga-data.mjs

echo.
echo Ingestion completed! Press any key to exit...
pause > nul
