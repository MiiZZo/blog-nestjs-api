import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as config from "config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: config.get("CLIENT_URL")
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(config.get("COOKIE_SECRET")));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  await app.listen(5000);
}

bootstrap();
