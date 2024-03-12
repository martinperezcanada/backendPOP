// src/modules/inventario/controllers/user.controller.ts

import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { UserService } from "../services/user/user.service";
import { UserEntity } from "../entities/user/user.entity";
import { RegisterDto } from "../dtos/register/register.dto";
import { LoginDto } from "../dtos/login/login.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserEntity> {
    return this.userService.findByEmail(email);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.userService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.userService.register(registerDto);
  }
}
