# Kangpack - Fullstack Launcher Script for PowerShell

# Save original location
$OrgLocation = Get-Location

# Set location to the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) {
    $ScriptDir = Get-Location
}
Set-Location $ScriptDir

# Colors and formatting helpers
function Write-Header {
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "   *** Kangpack - Fullstack Launcher Script ***   " -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
}

function Write-Info ($text) {
    Write-Host "[INFO] $text" -ForegroundColor Yellow
}

function Write-Success ($text) {
    Write-Host "[OK] $text" -ForegroundColor Green
}

function Write-ErrorMsg ($text) {
    Write-Host "[ERROR] $text" -ForegroundColor Red
}

Write-Header

# Parse command line arguments
$mode = "dev"
if ($args.Count -gt 0) {
    $arg = $args[0].ToLower()
    if ($arg -eq "prod" -or $arg -eq "--prod") {
        $mode = "prod"
    } elseif ($arg -eq "install" -or $arg -eq "--install") {
        $mode = "install"
    } elseif ($arg -eq "build" -or $arg -eq "--build") {
        $mode = "build"
    } elseif ($arg -eq "help" -or $arg -eq "--help" -or $arg -eq "-h") {
        Write-Host "Usage: .\run.ps1 [command]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  dev (default)   Start both backend and frontend in development mode"
        Write-Host "  prod            Start both in production mode"
        Write-Host "  install         Install dependencies in both backend and frontend"
        Write-Host "  build           Build both projects"
        Write-Host "  help            Show this help menu"
        Set-Location $OrgLocation
        exit 0
    }
}

# 1. Prerequisite checks
Write-Info "Checking prerequisites..."

$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-ErrorMsg "Error: Node.js is not installed. Please install Node.js (v18+) to run this project."
    Set-Location $OrgLocation
    exit 1
}
$nodeVer = node -v
Write-Success "Node.js: $nodeVer"

$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-ErrorMsg "Error: npm is not installed."
    Set-Location $OrgLocation
    exit 1
}
$npmVer = npm -v
Write-Success "npm: $npmVer"

# Implement modes
if ($mode -eq "install") {
    Write-Host "`n[DEPS] Installing clean dependencies..." -ForegroundColor Yellow
    Write-Host "[BACKEND] Installing backend dependencies..." -ForegroundColor Blue
    Set-Location "$ScriptDir/backend"
    npm install
    Write-Host "[FRONTEND] Installing frontend dependencies..." -ForegroundColor Green
    Set-Location "$ScriptDir/frontend"
    npm install
    Write-Success "Dependencies installation complete!"
    Set-Location $OrgLocation
    exit 0
}

if ($mode -eq "build") {
    Write-Host "`n[BUILD] Building both projects..." -ForegroundColor Yellow
    Write-Host "[BACKEND] Building backend..." -ForegroundColor Blue
    Set-Location "$ScriptDir/backend"
    npm run build
    Write-Host "[FRONTEND] Building frontend..." -ForegroundColor Green
    Set-Location "$ScriptDir/frontend"
    npm run build
    Write-Success "Build complete!"
    Set-Location $OrgLocation
    exit 0
}

# 2. Setup env files if missing
Write-Info "Checking configuration files..."

if (-not (Test-Path "backend/.env")) {
    Write-Host "  [WARN] backend/.env not found. Copying from .env.example..." -ForegroundColor Yellow
    if (Test-Path "backend/.env.example") {
        Copy-Item "backend/.env.example" "backend/.env"
        Write-Success "Created backend/.env. Please configure it with database credentials."
    } else {
        Write-ErrorMsg "Error: backend/.env.example not found."
    }
} else {
    Write-Success "backend/.env exists"
}

if (-not (Test-Path "frontend/.env.local")) {
    Write-Host "  [WARN] frontend/.env.local not found. Copying from .env.example..." -ForegroundColor Yellow
    if (Test-Path "frontend/.env.example") {
        Copy-Item "frontend/.env.example" "frontend/.env.local"
        Write-Success "Created frontend/.env.local."
    } else {
        Write-ErrorMsg "Error: frontend/.env.example not found."
    }
} else {
    Write-Success "frontend/.env.local exists"
}

# 3. Check and install dependencies if missing
function Check-AndInstallDeps($dir, $name) {
    if (-not (Test-Path "$dir/node_modules")) {
        Write-Host "`n[DEPS] Directory $dir/node_modules not found." -ForegroundColor Yellow
        Write-Host "Installing dependencies for $name... This may take a moment." -ForegroundColor Cyan
        Set-Location "$ScriptDir/$dir"
        npm install
        Write-Success "Dependencies for $name installed successfully."
    } else {
        Write-Success "$name dependencies already installed"
    }
}

Check-AndInstallDeps "backend" "Backend"
Check-AndInstallDeps "frontend" "Frontend"

# 4. Start concurrent processes
Write-Host "`n[RUN] Starting Backend and Frontend concurrently..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop both servers.`n" -ForegroundColor Cyan

# Cleanup handler
$backendJob = $null
$frontendJob = $null

if ($mode -eq "prod") {
    $pm2Check = Get-Command pm2 -ErrorAction SilentlyContinue
    if ($pm2Check) {
        Write-Host "`n[PM2] Starting both servers with PM2 (using ecosystem.config.js)..." -ForegroundColor Green
        Set-Location $ScriptDir
        pm2 start ecosystem.config.js
        pm2 status
        Write-Success "Done. Use 'pm2 log' to view logs or 'pm2 stop' to stop them."
        Set-Location $OrgLocation
        exit 0
    } else {
        Write-Host "`n[WARN] PM2 not found. Starting production servers manually..." -ForegroundColor Yellow
        if (-not (Test-Path "backend/dist")) {
            Write-Host "Backend build directory not found. Building backend..." -ForegroundColor Cyan
            Set-Location "$ScriptDir/backend"
            npm run build
        }
        if (-not (Test-Path "frontend/.next")) {
            Write-Host "Frontend build directory not found. Building frontend..." -ForegroundColor Cyan
            Set-Location "$ScriptDir/frontend"
            npm run build
        }

        Set-Location $ScriptDir
        $backendJob = Start-Job -ScriptBlock { Set-Location "$using:ScriptDir/backend"; npm run start }
        $frontendJob = Start-Job -ScriptBlock { Set-Location "$using:ScriptDir/frontend"; npm run start }
    }
} else {
    Set-Location $ScriptDir
    # Start processes in separate jobs
    $backendJob = Start-Job -ScriptBlock { Set-Location "$using:ScriptDir/backend"; npm run dev }
    $frontendJob = Start-Job -ScriptBlock { Set-Location "$using:ScriptDir/frontend"; npm run dev }
}

if ($backendJob -ne $null -and $frontendJob -ne $null) {
    Write-Host "`n[SUCCESS] Both servers are up and running in background jobs!" -ForegroundColor Green
    Write-Host "  * Backend Job ID: $($backendJob.Id)" -ForegroundColor Blue
    Write-Host "  * Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Green
    Write-Host "  * To view logs, run: Receive-Job -Job $($backendJob.Id) -Keep; Receive-Job -Job $($frontendJob.Id) -Keep" -ForegroundColor Cyan
    Write-Host "  * To stop servers, run: Stop-Job $($backendJob.Id), $($frontendJob.Id) or close this PowerShell window.`n" -ForegroundColor Cyan

    # Monitor jobs and stream output
    try {
        while ($backendJob.State -eq "Running" -and $frontendJob.State -eq "Running") {
            # Check if any new logs are available
            $bLogs = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
            if ($bLogs) {
                foreach ($line in $bLogs) {
                    Write-Host "[BACKEND] $line" -ForegroundColor Blue
                }
            }
            $fLogs = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
            if ($fLogs) {
                foreach ($line in $fLogs) {
                    Write-Host "[FRONTEND] $line" -ForegroundColor Green
                }
            }
            Start-Sleep -Milliseconds 200
        }
    }
    finally {
        Write-Host "`n[STOP] Shutting down background jobs gracefully..." -ForegroundColor Yellow
        Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
        Write-Success "Both jobs stopped."
        Set-Location $OrgLocation
    }
}
