import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slfk_user')
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: string;

  @Column({ comment: '用户名称', nullable: false })
  username: string;

  @Column({ comment: '用户密码', nullable: false })
  password: string;
}
