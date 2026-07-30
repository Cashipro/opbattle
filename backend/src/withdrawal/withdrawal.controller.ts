import {
Controller,
Post,
Get,
Body,
UseGuards
} from '@nestjs/common';


import {
WithdrawalService
} from './withdrawal.service';



import {
JwtGuard
} from '../auth/jwt.guard';



import {
CurrentUser
} from '../auth/current-user.decorator';







@Controller('withdrawal')

export class WithdrawalController {



constructor(

private withdrawalService: WithdrawalService

){}









@Post('create')

@UseGuards(JwtGuard)

create(

@CurrentUser() user:any,

@Body() body:any

){


return this.withdrawalService.create(

user.id,

body

);


}









@Get()

@UseGuards(JwtGuard)

myWithdrawals(

@CurrentUser() user:any

){


return this.withdrawalService.myWithdrawals(

user.id

);


}



}
