import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'usuario',
  database: 'FernanPOP',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
