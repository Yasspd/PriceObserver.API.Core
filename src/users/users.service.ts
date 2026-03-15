import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCurrentUser(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.getCurrentUser(userId);
    return this.usersRepository.updateProfile(userId, dto);
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    await this.getCurrentUser(userId);
    return this.usersRepository.updateSettings(userId, dto);
  }
}
