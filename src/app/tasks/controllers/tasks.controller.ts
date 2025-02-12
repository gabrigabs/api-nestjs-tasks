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
  Logger,
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
  private readonly logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTask(
    @Body() body: CreateTaskDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    this.logger.log(`Creating task for user: ${user.id}`);
    const task = await this.tasksService.createTask(body, user.id);
    this.logger.log(`Task created successfully with id: ${task.id}`);
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(@Query() query: FindTasksQueryDto): Promise<PaginatedTasks> {
    this.logger.log(`Finding tasks with query: ${JSON.stringify(query)}`);
    const tasks = await this.tasksService.findTasks(query);
    this.logger.log(`Found ${tasks.total} tasks`);
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Task | null> {
    this.logger.log(`Finding task by id: ${id}`);
    const task = await this.tasksService.findTaskById(id);
    this.logger.log(`Task id: ${id} ${task ? 'found' : 'not found'}`);
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTaskDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    this.logger.log(`Updating task ${id} for user: ${user.id}`);
    const task = await this.tasksService.updateTask(body, id, user.id);
    this.logger.log(`Task id: ${id} updated successfully`);
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserSession() user: UserWithoutPassword,
  ): Promise<void> {
    this.logger.log(`Deleting task ${id} for user: ${user.id}`);
    await this.tasksService.deleteTask(id, user.id);
    this.logger.log(`Task id: ${id} deleted successfully`);
  }
}
