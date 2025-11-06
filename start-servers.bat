@echo off
echo Starting Anambra Health GeoHub Servers...
echo.
echo Starting Backend Server on port 3001...
start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Dev Server...
start "Frontend Server" cmd /k "npm run dev"
echo.
echo ========================================
echo Servers Starting!
echo ========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173 (or next available port)
echo.
echo Map URL:  http://localhost:5173/facility-map
echo.
echo Press any key to stop all servers...
pause >nul
echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Backend Server*" /T /F
taskkill /FI "WINDOWTITLE eq Frontend Server*" /T /F
