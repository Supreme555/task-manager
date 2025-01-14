import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

export enum TaskStatus {
  COMPLETED = 'completed',
  NOT_COMPLETED = 'not_completed'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'nvarchar',
    enum: TaskPriority,
    default: TaskPriority.NONE,
  })
  priority: TaskPriority;

  @Column({
    type: 'nvarchar',
    enum: TaskStatus,
    default: TaskStatus.NOT_COMPLETED,
  })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 