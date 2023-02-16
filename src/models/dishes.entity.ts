import { Restaurant } from "./restaurant.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Dishes {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column()
  description: string;

  @OneToMany((_type) => Restaurant, (restaurant) => restaurant.menu, {
    eager: true,
    onDelete: "CASCADE",
  })
  restaurant: Restaurant[];
}
