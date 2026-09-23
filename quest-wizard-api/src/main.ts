import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Omoćavanje CORS-a za vaš frontend na portu 4200
  app.enableCors({
    origin: "http://localhost:4200", // Dozvoli samo vaš frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Dozvoljene HTTP metode
    credentials: true, // Dozvoli slanje kolačića i auth hedera ako zatreba
  });

  // 2. Postavljanje globalnih pajpova
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 3. Konfiguracija Swagger dokumentacije
  const config = new DocumentBuilder()
    .setTitle("Wizard Quest API")
    .setDescription("API dokumentacija za Wizard Quest projekat")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  // 4. Kreiranje i povezivanje Swagger UI-ja
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // 5. Pokretanje aplikacije
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();