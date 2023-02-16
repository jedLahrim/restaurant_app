import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Restaurant } from "./restaurant.entity";
@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ nullable: true })
  coverImg: string;
  @OneToMany((_type) => Restaurant, (restaurant) => restaurant.category, {
    eager: true,
    onDelete: "CASCADE",
  })
  restaurant: Restaurant[];
}
