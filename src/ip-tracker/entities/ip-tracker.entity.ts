import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ip' })
export class IpTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column({ type: 'timestamp' })
  windowStart: Date;

  @Column()
  requestCount: number;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  blockUntil: Date;
}
