import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_tokens') 
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ unique: true, nullable: false })
  token: string;

  @Column({ type: 'timestamptz', nullable: false })
  expires_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;
}
