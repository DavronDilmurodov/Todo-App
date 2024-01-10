import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateTodoDto) {
    return this.todoService.create(body);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.todoService.findAll(id);
  }

  @Put('/iscompleted/:id/:createdBy')
  isCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Param('createdBy') createdBy: string,
  ) {
    return this.todoService.isCompleted(id, createdBy);
  }

  @Put(':id/:createdBy')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('createdBy') createdBy: string,
    @Body() body: UpdateTodoDto,
  ) {
    return this.todoService.update(id, createdBy, body);
  }

  @Delete(':id/:createdBy')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('createdBy') createdBy: string,
  ) {
    return this.todoService.remove(id, createdBy);
  }
}
