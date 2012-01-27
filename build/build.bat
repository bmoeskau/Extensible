::############################################
::
::  Extensible build script
::  Contributed by devil1591
::
::############################################
@echo off

:: Configuration
:: The current version string, substituted into the build path below
set VER=extensible-1.0.2

:: Default the root to the parent of the current \build folder
set EXTENSIBLE_ROOT=%CD%\..

:: Output everything here
set EXTENSIBLE_OUTPUT=%EXTENSIBLE_ROOT%\deploy

:: Program start
echo.
IF NOT EXIST %EXTENSIBLE_ROOT%\NUL GOTO E_FOLDER_NOT_FOUND
IF "%1" == "-h" GOTO E_USAGE

:: Any cleanup that needs to happen prior to the build
del "%EXTENSIBLE_ROOT%\resources\css\extensible-all.css"

:: Build it
java -jar JSBuilder2.jar --projectFile %EXTENSIBLE_ROOT%\build\extensible.jsb2 --homeDir %EXTENSIBLE_OUTPUT%

:: Copy the deploy files back into dev so that the samples get the latest code
echo Updating dev...
xcopy /y /q "%EXTENSIBLE_OUTPUT%\%VER%\extensible-all.js" "%EXTENSIBLE_ROOT%" > nul
xcopy /y /q "%EXTENSIBLE_OUTPUT%\%VER%\extensible-all-debug.js" "%EXTENSIBLE_ROOT%" > nul
xcopy /y /q "%EXTENSIBLE_OUTPUT%\%VER%\resources\css\extensible-all.css" "%EXTENSIBLE_ROOT%\resources\css" > nul

:: Copy other resource files to output
xcopy /y /q "%EXTENSIBLE_ROOT%\Extensible-config.js" "%EXTENSIBLE_OUTPUT%\%VER%\" > nul
xcopy /y /q "%EXTENSIBLE_ROOT%\*.html" "%EXTENSIBLE_OUTPUT%\%VER%\" > nul
::xcopy /y /q "%EXTENSIBLE_ROOT%\*.css" "%EXTENSIBLE_OUTPUT%\%VER%\" > nul
xcopy /y /q "%EXTENSIBLE_ROOT%\*.txt" "%EXTENSIBLE_OUTPUT%\%VER%\" > nul
xcopy /y /q "%EXTENSIBLE_ROOT%\*.md" "%EXTENSIBLE_OUTPUT%\%VER%\" > nul

:: Docs
IF "%1" == "-d" (
   echo Generating docs...
   java -jar ext-doc.jar -p extensible.xml -o %EXTENSIBLE_OUTPUT%\%VER%\docs -t template\ext\template.xml
)

echo All done!
goto EOF

:E_FOLDER_NOT_FOUND
echo The folder %EXTENSIBLE_ROOT% doesn't exist!
echo Please update build.bat with the correct path for EXTENSIBLE_ROOT
goto EOF

:E_USAGE
echo.
echo    usage: build.bat [-d]
echo.
echo           -d: Include updated docs in the output
echo.

:EOF