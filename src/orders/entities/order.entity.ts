import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './order-items.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.pending,
  })
  status: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paied_time: Date;

  @Column({ type: 'bigint' })
  total_price: number;

  @Column({ type: 'varchar', nullable: true })
  discount_code: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (order_items) => order_items.order)
  items: OrderItem[];
}
