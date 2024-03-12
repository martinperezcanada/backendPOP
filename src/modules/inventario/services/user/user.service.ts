import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../dtos/user/create-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new HttpException('Error al crear el usuario', HttpStatus.BAD_REQUEST);
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.findByEmail(email);
      if (!user || user.contraseña !== password) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      const payload = { email };
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new HttpException('Error al iniciar sesión', HttpStatus.UNAUTHORIZED);
    }
  }

  async register(createUserDto: CreateUserDto): Promise<string> {
    try {
      const { email, contraseña } = createUserDto;
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new UnauthorizedException('El correo electrónico ya está registrado');
      }
      const newUser = await this.create(createUserDto);
      const payload = { email };
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new HttpException('Error al registrar usuario', HttpStatus.BAD_REQUEST);
    }
  }
}
