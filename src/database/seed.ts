import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { Template, TemplateDocument } from "../modules/templates/schemas/template.schema";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { TemplatesSeeder } from "./seeders/templates.seeder";

async function boostrap() {
    const app = await NestFactory.createApplicationContext(AppModule);


    const templatesSeeder = app.get(TemplatesSeeder);

    await templatesSeeder.run();



    await app.close();

    console.log("Database seeding completed");

}

boostrap();