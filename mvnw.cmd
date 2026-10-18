@echo off
setlocal
if not defined JAVA_HOME (
  if exist "C:\Program Files\Java\jdk-21.0.10" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
  )
)
if exist "%USERPROFILE%\.m2\apache-maven-3.9.6\bin\mvn.cmd" (
  call "%USERPROFILE%\.m2\apache-maven-3.9.6\bin\mvn.cmd" -f backend\pom.xml %*
  exit /b %ERRORLEVEL%
)
if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.14\ed7edd442f634ac1c1ef5ba2b61b6d690b5221091f1a8e1123f5fadcc967520d\bin\mvn.cmd" (
  call "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.14\ed7edd442f634ac1c1ef5ba2b61b6d690b5221091f1a8e1123f5fadcc967520d\bin\mvn.cmd" -f backend\pom.xml %*
  exit /b %ERRORLEVEL%
)
call mvn -f backend\pom.xml %*
exit /b %ERRORLEVEL%
