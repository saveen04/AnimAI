# Run full AI training pipeline: download dataset -> train model
# Requires: Python 3.10+, pip install -r ai-model/requirements.txt

$ErrorActionPreference = "Stop"
$aiDir = Join-Path $PSScriptRoot ".." "ai-model"
Set-Location $aiDir

Write-Host "Creating virtual environment..." -ForegroundColor Cyan
if (-not (Test-Path "venv")) {
    python -m venv venv
}
& .\venv\Scripts\Activate.ps1

Write-Host "Installing dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt -q

Write-Host "Downloading cats_vs_dogs dataset (may take ~5-10 min)..." -ForegroundColor Cyan
python download_dataset.py

Write-Host "Training CNN model (may take ~10-30 min)..." -ForegroundColor Cyan
python train_model.py

Write-Host "Done. Start FastAPI with: python main.py" -ForegroundColor Green
