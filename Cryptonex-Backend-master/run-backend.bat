@echo off
REM CryptoNex Backend Launcher
REM Uses cached Maven 3.9.7 + Java 21 to start Spring Boot

SET "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
SET "PATH=%JAVA_HOME%\bin;%PATH%"
SET "MVN=C:\Users\Vaibhavi Kahar\.m2\wrapper\dists\apache-maven-3.9.7\744dcc12d591e1ad9413e3296c618fd8\bin\mvn.cmd"

REM Environment variables are now inherited directly from start.js / .env

echo [BACKEND] JAVA_HOME  = %JAVA_HOME%
echo [BACKEND] DB URL     = %SPRING_DATASOURCE_URL%
echo [BACKEND] DB User    = %SPRING_DATASOURCE_USERNAME%
echo [BACKEND] Starting Spring Boot on port 1106...

"%MVN%" spring-boot:run
