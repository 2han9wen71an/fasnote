@echo off
echo Starting Jekyll with optimized settings...

:: 检查是否在 PowerShell 中运行
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    powershell -Command "bundle exec jekyll serve --incremental --config _config.yml --profile --trace --limit_posts 10 --skip_initial_build_checks"
) else (
    bundle exec jekyll serve --incremental --config _config.yml --profile --trace --limit_posts 10 --skip_initial_build_checks
) 