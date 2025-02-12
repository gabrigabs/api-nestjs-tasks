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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TasksControllerInterface } from './tasks.controllers.interface';
import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { TasksService } from '../services/tasks.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserSession } from '../../commons/decorators/user.decorator';
import { UserWithoutPassword } from '../../commons/interfaces/user.interface';
import { FindTasksQueryRequestDto } from '../dtos/requests/find-task-query-request.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskResponseDto } from '../dtos/responses/tasks-response.dto';
import { ErrorResponseDto } from '../../commons/dtos/error-response.dto';
import { PaginatedTasksResponseDto } from '../dtos/responses/paginated-tasks-response.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController implements TasksControllerInterface {
  private readonly logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Create task',
    description: 'Creates a new task',
  })
  @ApiCreatedResponse({ type: TaskResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation Error',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Unauthorized',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addTask(
    @Body() body: CreateTaskRequestDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    this.logger.log(`Creating task for user: ${user.id}`);
    const task = await this.tasksService.createTask(body, user.id);
    this.logger.log(`Task created successfully with id: ${task.id}`);
    return task;
  }

  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'gets all tasks with pagination options with query params, also can be filtered by the status field',
  })
  @ApiOkResponse({ type: PaginatedTasksResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation Error',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Unauthorized',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(
    @Query() query: FindTasksQueryRequestDto,
  ): Promise<PaginatedTasksResponseDto> {
    this.logger.log(`Finding tasks with query: ${JSON.stringify(query)}`);
    const tasks = await this.tasksService.findTasks(query);
    this.logger.log(`Found ${tasks.total} tasks`);
    return tasks;
  }

  @ApiOperation({
    summary: 'Get tasks by id',
    description: 'Gets a task by provided uuid',
  })
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation Error',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Not Found Error',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Internal server error',
  })
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

  @ApiOperation({
    summary: 'Update task by id',
    description:
      'Updates a task by provided uuid if it belongs to the authenticated user',
  })
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation Error',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Not Found Error',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTaskRequestDto,
    @UserSession() user: UserWithoutPassword,
  ): Promise<Task> {
    this.logger.log(`Updating task ${id} for user: ${user.id}`);
    const task = await this.tasksService.updateTask(body, id, user.id);
    this.logger.log(`Task id: ${id} updated successfully`);
    return task;
  }

  @ApiOperation({
    summary: 'Delete task by id',
    description:
      'Deletes a task by provided uuid if it belongs to the authenticated user',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation Error',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Not Found Error',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
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
