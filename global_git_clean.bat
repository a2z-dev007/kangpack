@echo off
echo --- CLEANING MAIN ---
git checkout main
git rm --cached backend/.env.production 2>nul
git rm --cached frontend/.env.production 2>nul
git add .
git commit -m "chore: definitively untrack environment files"
git push origin main

echo --- CLEANING REDESIGN ---
git checkout redesign
git rm --cached backend/.env.production 2>nul
git rm --cached frontend/.env.production 2>nul
git add .
git commit -m "chore: definitively untrack environment files"
git push origin redesign

echo --- VERIFYING ---
git ls-files -c | findstr /i ".env"
