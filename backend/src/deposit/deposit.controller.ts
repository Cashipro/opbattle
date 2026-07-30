import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get
} from '@nestjs/common';


import {
  DepositService
} from './deposit.service';


import {
  JwtGuard
} from '../auth/jwt.guard';


import {
  CurrentUser
} from '../auth/current-user.decorator';



@Controller('deposit')

export class DepositController {


constructor(

private depositService:DepositService

){}





@Post('create')

@UseGuards(JwtGuard)

create(

@CurrentUser() user:any,

@Body() body:any

){

return this.depositService.create(

user.id,

body

);

}






@Get('my')

@UseGuards(JwtGuard)

myDeposits(

@CurrentUser() user:any

){

return this.depositService.myDeposits(

user.id

);

}



}
