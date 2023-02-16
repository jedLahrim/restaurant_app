import { DataSource, DataSourceOptions } from 'typeorm';
import {User} from "../Models/user.entity";

const dataSource_config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 8864,
  username: 'restaurantUser',
  password: 'thisIsPassword',
  database: 'postgres',
  entities: ['src/models/*{.ts,.js}'],
  synchronize: true,
};

export default dataSource_config;
