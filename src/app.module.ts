import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './modules/inventario/entities/product/product.entity';
import { ProductsController } from './modules/inventario/controllers/product.controller';
import { ProductService } from './modules/inventario/services/product/product.service';
import { typeOrmConfig } from './typeorm.config';
import { UserEntity } from './modules/inventario/entities/user/user.entity';
import { UserController } from './modules/inventario/controllers/user.controller';
import { UserService } from './modules/inventario/services/user/user.service';
import { AuthController } from './modules/inventario/controllers/auth.controller';
import { AuthService } from './modules/inventario/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '1h' },
    }), 
  ],
  controllers: [ProductsController, UserController, AuthController], 
  providers: [ProductService, UserService, AuthService], 
})
export class AppModule {}
