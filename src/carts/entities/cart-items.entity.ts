import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Book } from 'src/books/entities/book.entity';

@Entity({ name: 'cart-items' })
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Book, (book) => book.orderItems)
  book: Book;

  @Column({ type: 'int' })
  quantity: number;
}
