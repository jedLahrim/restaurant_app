import { Restaurant } from "./restaurant.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Dishes {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  description: string;

  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;
}
