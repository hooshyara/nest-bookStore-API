import { Genres } from 'src/genres/entities/genre.entity';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  author: string;

  @Column({ type: 'int', nullable: false })
  public_year: number;

  @Column({ type: 'bigint', nullable: false })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isValid: boolean;

  @ManyToOne(() => Genres, (genre) => genre.books, { eager: true })
  @JoinColumn({ name: 'genre_id' })
  genre: Genres;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.book)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
