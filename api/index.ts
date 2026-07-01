import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import express from "express";
import { AppModule } from "../dist/app.module";

const server = express();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.init();
    return server;
}

let cachedServer: express.Express;

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    cachedServer(req, res);
}
