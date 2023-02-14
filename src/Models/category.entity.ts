import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Restaurant } from "./restaurant.entity";

export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ nullable: true })
  coverImg: string;
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.category, {
    nullable: true,
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;
}
