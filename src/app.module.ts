import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ArticlesModule } from "./articles/articles.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    ArticlesModule,
    TypeOrmModule.forRoot({ synchronize: true })
  ]
})
export class AppModule {}
