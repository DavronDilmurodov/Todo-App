import { Optional } from '@nestjs/common';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsNotEmpty()
  createdBy: string;

  @Optional()
  text: string;
}
