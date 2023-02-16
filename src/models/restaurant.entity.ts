import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";
import { Dishes } from "./dishes.entity";
import { Exclude } from "class-transformer";

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

  // @ManyToOne((_type) => Category, (category) => category.restaurant, {
  //   onDelete: "CASCADE",
  // })
  // category: Category;

  @ManyToOne((_type) => Category, (category) => category.restaurant, {
    onDelete: "CASCADE",
  })
  category: Category;

  @ManyToOne((_type) => User, (owner) => owner.restaurant, {
    onDelete: "CASCADE",
  })
  @Exclude()
  owner: User;

  @ManyToOne((_type) => Dishes, (menu) => menu.restaurant, {
    onDelete: "CASCADE",
  })
  menu: Dishes;
}
