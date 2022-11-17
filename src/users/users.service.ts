import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './model/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserSchema: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.UserSchema(createUserDto);
    const user = await newUser.save();
    return user._id;
  }

  async findAll() {
    const users = await this.UserSchema.find().exec();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
