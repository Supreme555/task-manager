import { IsString, IsNotEmpty, IsEnum, IsOptional, MinLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Title must be at least 4 characters long' })
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.NONE;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.NOT_COMPLETED;
} 