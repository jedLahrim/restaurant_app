import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user";
import { Dishes } from "./dishes.entity";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Column()
  coverImage: string;
  @Column()
  address: string;

  @Column()
  isPromoted: boolean;

  @ManyToOne((type) => Category, (category) => category.restaurant, {
    nullable: true,
    onDelete: "CASCADE",
  })
  category: Category;

  @ManyToOne((type) => User, (user) => user.restaurant, {
    nullable: true,
    onDelete: "CASCADE",
  })
  owner: User;

  @OneToMany((type) => Dishes, (menu) => menu.restaurant)
  menu: Dishes[];
}
