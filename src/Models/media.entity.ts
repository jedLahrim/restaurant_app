import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  // @Exclude()
  id: string;
  @Column({ default: null })
  outputVideo: string;
  @Column({ default: null })
  created_by: string;
  @Column({ default: null })
  pid: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  // buffer: ChildProcess;
}
