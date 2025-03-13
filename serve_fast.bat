@echo off
echo Starting Jekyll with fast development settings...

:: 删除缓存文件以避免潜在问题
if exist .jekyll-metadata del .jekyll-metadata
if exist .jekyll-cache rmdir /s /q .jekyll-cache

:: 检查是否在 PowerShell 中运行
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    powershell -Command "bundle exec jekyll serve --incremental --config _config.yml,_config_dev.yml --profile --trace --limit_posts 5 --skip-initial-build --watch --livereload"
) else (
    bundle exec jekyll serve --incremental --config _config.yml,_config_dev.yml --profile --trace --limit_posts 5 --skip-initial-build --watch --livereload
) 