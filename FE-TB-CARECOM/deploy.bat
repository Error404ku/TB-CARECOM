@echo off
REM TB-CARECOM Frontend Deployment Script for Windows
REM Usage: deploy.bat [prod|dev|stop|logs]

setlocal enabledelayedexpansion

REM Colors for output (limited in Windows CMD)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Check if Docker is installed
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Main logic
if "%1"=="" goto show_help
if "%1"=="prod" goto deploy_production
if "%1"=="production" goto deploy_production
if "%1"=="dev" goto deploy_development
if "%1"=="development" goto deploy_development
if "%1"=="stop" goto stop_containers
if "%1"=="logs" goto show_logs
if "%1"=="help" goto show_help
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

echo %ERROR% Unknown command: %1
goto show_help

:deploy_production
echo %INFO% Deploying TB-CARECOM Frontend in Production Mode...

REM Check if .env file exists
if not exist ".env" (
    echo %WARNING% .env file not found. Creating from template...
    copy env.production.example .env
    echo %WARNING% Please edit .env file with your production values.
    echo %INFO% Opening .env file for editing...
    notepad .env
)

REM Create logs directory
if not exist "logs\nginx" mkdir logs\nginx

REM Build and start
echo %INFO% Building and starting containers...
docker-compose down --remove-orphans
docker-compose up -d --build

echo %SUCCESS% Production deployment completed!
echo %INFO% Frontend URL: http://localhost:3000
echo %INFO% Health Check: http://localhost:3000/health
echo %INFO% View logs: deploy.bat logs
goto end

:deploy_development
echo %INFO% Deploying TB-CARECOM Frontend in Development Mode...

REM Stop production if running
docker-compose down --remove-orphans >nul 2>&1

REM Start development
echo %INFO% Building and starting development containers...
docker-compose -f docker-compose.dev.yml down --remove-orphans
docker-compose -f docker-compose.dev.yml up -d --build

echo %SUCCESS% Development deployment completed!
echo %INFO% Development Server: http://localhost:5173
echo %INFO% Hot reload is enabled for source code changes
echo %INFO% View logs: deploy.bat logs dev
goto end

:stop_containers
echo %INFO% Stopping all TB-CARECOM containers...
docker-compose down --remove-orphans
docker-compose -f docker-compose.dev.yml down --remove-orphans
echo %SUCCESS% All containers stopped.
goto end

:show_logs
if "%2"=="dev" (
    echo %INFO% Showing development logs...
    docker-compose -f docker-compose.dev.yml logs -f frontend-dev
) else (
    echo %INFO% Showing production logs...
    docker-compose logs -f frontend
)
goto end

:show_help
echo TB-CARECOM Frontend Deployment Script for Windows
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   prod     Deploy in production mode
echo   dev      Deploy in development mode
echo   stop     Stop all containers
echo   logs     Show production logs
echo   logs dev Show development logs
echo   help     Show this help message
echo.
echo Examples:
echo   %0 prod           # Deploy production
echo   %0 dev            # Deploy development
echo   %0 logs           # View production logs
echo   %0 stop           # Stop all containers

:end
endlocal 