@echo off
echo Removing .env files from git index...
git rm --cached backend/.env 2>nul
git rm --cached backend/.env.production 2>nul
git rm --cached frontend/.env 2>nul
git rm --cached frontend/.env.local 2>nul
git rm --cached frontend/.env.production 2>nul
git status
