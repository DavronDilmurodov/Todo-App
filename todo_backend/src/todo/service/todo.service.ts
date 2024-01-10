import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { Repository } from 'typeorm';
import { ResponseInterface } from '../../interfaces/response.interface';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(body: CreateTodoDto): Promise<ResponseInterface> {
    try {
      const newTodo = this.todoRepository.create(body);
      await this.todoRepository.save(newTodo);
      return {
        message: 'CREATED',
        data: newTodo,
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(id: string): Promise<ResponseInterface> {
    try {
      const allTodo = await this.todoRepository.find({
        where: { createdBy: id },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        message: 'OK',
        data: allTodo,
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, createdBy: string): Promise<ResponseInterface> {
    try {
      const foundUser = await this.todoRepository.findOneBy({ createdBy });
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      const foundTodo = await this.todoRepository.findOneBy({ id });
      if (!foundTodo) {
        throw new NotFoundException('Todo not found');
      }
      if (foundUser.createdBy !== foundTodo.createdBy) {
        throw new BadRequestException(
          'You do not have and access to remove this todo',
        );
      }

      await this.todoRepository.remove(foundTodo);
      return {
        message: 'DELETED',
        data: null,
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async isCompleted(id: number, createdBy: string): Promise<ResponseInterface> {
    try {
      const foundUser = await this.todoRepository.findOneBy({ createdBy });
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      const foundTodo = await this.todoRepository.findOneBy({ id });
      if (!foundTodo) {
        throw new NotFoundException('Todo not found');
      }
      if (foundUser.createdBy !== foundTodo.createdBy) {
        throw new BadRequestException(
          'You do not have and access to remove this todo',
        );
      }

      if (foundTodo.isCompleted === true) {
        await this.todoRepository.update({ id }, { isCompleted: false });
      } else {
        await this.todoRepository.update({ id }, { isCompleted: true });
      }

      const updatedTodo = await this.todoRepository.findOneBy({ id });

      return {
        message: 'UPDATED',
        data: updatedTodo,
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, createdBy: string, { text, title }: UpdateTodoDto) {
    try {
      if (!text && !title) {
        throw new BadRequestException('Please edit something');
      }

      const foundUser = await this.todoRepository.findOneBy({ createdBy });
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      const foundTodo = await this.todoRepository.findOneBy({ id });
      if (!foundTodo) {
        throw new NotFoundException('Todo not found');
      }
      if (foundUser.createdBy !== foundTodo.createdBy) {
        throw new BadRequestException(
          'You do not have and access to remove this todo',
        );
      }

      await this.todoRepository.update({ id }, { text, title });

      const updatedTodo = await this.todoRepository.findOneBy({ id });
      return {
        message: 'UPDATED',
        data: updatedTodo,
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
