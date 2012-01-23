:: Contributed by devil1591
@echo off

:: Configuration
set VER=extensible-1.5.0
set EXTENSIBLE_ROOT=D:\Projects\Extensible
set EXTENSIBLE_OUTPUT=%EXTENSIBLE_ROOT%\deploy

:: Program start
echo.
IF NOT EXIST %EXTENSIBLE_ROOT%\NUL GOTO E_FOLDER_NOT_FOUND
IF "%1" == "-h" GOTO E_USAGE

:: Any cleanup that needs to happen prior to the build
del "%EXTENSIBLE_ROOT%\resources\css\extensible-all.css"

:: Build it
java -jar JSBuilder2.jar --projectFile %EXTENSIBLE_ROOT%\extensible.jsb2 --homeDir %EXTENSIBLE_OUTPUT%

:: Copy the deploy files back into dev so that the samples get the latest code
echo Updating dev...
xcopy "%EXTENSIBLE_OUTPUT%\%VER%\extensible-all.js" "%EXTENSIBLE_ROOT%" /H /Y
xcopy "%EXTENSIBLE_OUTPUT%\%VER%\extensible-all-debug.js" "%EXTENSIBLE_ROOT%" /H /Y
xcopy "%EXTENSIBLE_OUTPUT%\%VER%\resources\css\extensible-all.css" "%EXTENSIBLE_ROOT%\resources\css" /H /Y

:: Copy other resource files to output
xcopy "%EXTENSIBLE_ROOT%\*" "%EXTENSIBLE_OUTPUT%\%VER%\" /H /Y

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
echo usage: build.bat [-d]
echo.
echo        -d: Include updated docs in the output

:EOF
echo.