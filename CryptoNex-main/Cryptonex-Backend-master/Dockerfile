# Stage 1: Build stage
FROM openjdk:17-jdk-slim as build

# Set the working directory
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Grant execution permissions to Maven wrapper
RUN chmod +x mvnw

# Download dependencies (improves build caching)
RUN ./mvnw dependency:resolve

# Copy the source code
COPY src ./src

# Package the application (skipping tests)
RUN ./mvnw clean package -DskipTests && ls target

# Stage 2: Runtime stage
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar /app/cryptoNex.jar

# Expose the port the application will run on
EXPOSE 1106

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/cryptoNex.jar"]
