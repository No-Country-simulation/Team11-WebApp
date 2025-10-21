# 1️⃣ Imagen base ligera de Java
FROM openjdk:17-jdk-alpine

# 2️⃣ Crear un usuario no root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# 3️⃣ Directorio de trabajo
WORKDIR /app

# 4️⃣ Copiar el JAR desde target/
COPY target/pyme-creditos-0.0.1-SNAPSHOT.jar app.jar

# 5️⃣ Cambiar a usuario no root
USER spring:spring

# 6️⃣ Exponer el puerto que usa tu aplicación (Spring Boot por defecto 8080)
EXPOSE 8080

# 7️⃣ Comando por defecto para iniciar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
