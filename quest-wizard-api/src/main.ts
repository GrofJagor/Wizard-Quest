import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: "http://localhost:4200", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials: true, 
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));


  const config = new DocumentBuilder()
    .setTitle("Wizard Quest API")
    .setDescription("API dokumentacija za Wizard Quest projekat")
    .setVersion("1.0")
    .addBearerAuth()
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // 5. Pokretanje aplikacije
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();