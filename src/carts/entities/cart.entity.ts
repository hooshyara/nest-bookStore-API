import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItems } from './cart-items.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToMany(() => CartItems, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItems[];
}
