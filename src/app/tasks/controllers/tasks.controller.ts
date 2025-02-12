import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksControllerInterface } from './tasks.controllers.interface';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TasksService } from '../services/tasks.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserSession } from '../../commons/decorators/user.decorator';
import { UserWithoutPassword } from '../../commons/interfaces/user.interface';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';
import { FindTasksQueryDto } from '../dtos/find-task-query.dto';

@Controller('tasks')
export class TasksController implements TasksControllerInterface {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addTask(
    @Body() body: CreateTaskDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    return this.tasksService.createTask(body, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Query() query: FindTasksQueryDto): Promise<PaginatedTasks> {
    return this.tasksService.findTasks(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Task | null> {
    return this.tasksService.findTaskById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTaskDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    return this.tasksService.updateTask(body, id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserSession() user: UserWithoutPassword,
  ): Promise<void> {
    await this.tasksService.deleteTask(id, user.id);
  }
}
