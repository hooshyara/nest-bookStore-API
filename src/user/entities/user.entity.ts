import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import userRoleEnum from '../enum/userRoleEnum';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  mobile: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({
    type: 'enum',
    enum: userRoleEnum,
    default: userRoleEnum.NormalUser,
  })
  role: userRoleEnum;

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];
}
