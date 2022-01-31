import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { FindManyOptions } from 'typeorm';
import { userEntity } from '../../Entities';
import { AuthGuard, authRequest, RoleGuard } from '../auth';
import { Roles } from '../auth/roles.decorator';
import { userUpdateDto } from './userUpdate.DTO';
import { UserService } from './user.service';
import { userMinDto } from './userMin.DTO';

class idDto {
  @IsString()
  id: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //gets own user data
  @UseGuards(AuthGuard)
  @Get()
  getMyData(@Req() req: authRequest) {
    return this.userService.getMyData(req.user.sub);
  }

  //gets all username
  @UseGuards(AuthGuard)
  @Get('/all')
  getAll() {
    return this.userService.getAllUsername();
  }

  //Create user
  @UseGuards(AuthGuard)
  @Put()
  create(
    @Req() req: authRequest,
    @Body() body: userMinDto
  ): Promise<userEntity> {
    //const body: userMin = { id: 0, username: '', email: '', authId: '' };
    return this.userService.new(req.user.sub, body);
  }

  //Delete user
  @UseGuards(AuthGuard)
  @Delete()
  delete(@Req() req: authRequest) {
    return this.userService.delete(req.user.sub);
  }

  //Modify user
  @UseGuards(AuthGuard)
  @Patch()
  modify(@Req() req: authRequest, @Body() body: userUpdateDto) {
    const newUser: {
      username: string;
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    } = {
      username: body.username,
      id: req.user.sub,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
    };
    return this.userService.update(newUser.id, newUser);
  }

  //get all user's all information
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  find(@Body() body: FindManyOptions) {
    return this.userService.find(body);
  }

  //Add role to user
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Post('/role')
  addRole(@Body() body: idDto) {
    return this.userService.addUserRole(body.id);
  }

  // //Remove role from user
  // @Post()
  // removeRole() {
  //   return this.userService.removeRole();
  // }
}
