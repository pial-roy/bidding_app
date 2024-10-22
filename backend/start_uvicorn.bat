@echo off
setlocal

:: Change directory to the app folder where both .env and uvicorn are located
cd app

:: Load environment variables from the .env file
for /f "tokens=1,2 delims==" %%a in ('findstr "=" .env') do set %%a=%%b

:: Debugging: Print loaded environment variables
echo HOST=%HOST%
echo UVICORN_PORT=%UVICORN_PORT%
echo MONGODB_URL=%MONGODB_URL%
echo DATABASE_NAME=%DATABASE_NAME%

cd .. 
:: Run the Uvicorn server with the host and port from the .env file
python -m uvicorn app.main:app --host %HOST% --port %UVICORN_PORT% --reload

endlocal