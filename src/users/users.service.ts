import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(id: string) {
    return this.findUser(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, email, password } = updateUserDto;
    const user = await this.UserSchema.findOneAndUpdate(
      { _id: id },
      { name, email, password },
      { new: true },
    );

    try {
      if (!user) {
        throw new NotFoundException('Could not find user.');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
  }

  async remove(id: string) {
    const user = await this.UserSchema.findByIdAndDelete(id);
    return user._id;
  }

  private async findUser(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.UserSchema.findById(id).exec();
      if (!user) {
        throw new NotFoundException('Could not find user.');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
  }
}
