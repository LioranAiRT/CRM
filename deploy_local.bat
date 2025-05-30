@echo off
echo === Lioran Survey Builder - Deploy Local ===

REM Verifică dacă Node.js este instalat
where node
if %errorlevel% neq 0 (
    echo [Eroare] Node.js nu este instalat. Instaleaza-l de la https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo === Instalare dependente npm... ===
npm install
echo.
echo Apasa o tasta pentru a continua la pornirea aplicatiei...
pause

echo === Pornire server local... ===
REM Ruleaza npm start si lasa fereastra deschisa la final
cmd /k "npm start"

REM Daca ajungi aici, npm start s-a terminat (de obicei nu se intampla)
echo.
echo === Script terminat ===
pause