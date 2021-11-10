import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClassesModule } from '@components/classes/classes.module';
import AuthModule from '@components/auth/auth.module';
import UsersModule from '@components/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT as unknown as number,
      database: process.env.MYSQL_DB,
      username: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_PASSWORD,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    ClassesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
