import {
Controller,
Get,
Post,
Param
} from '@nestjs/common';


import {
AdminDepositService
} from './admin-deposit.service';






@Controller('admin/deposits')

export class AdminDepositController {



constructor(

private adminDepositService: AdminDepositService

){}








@Get()

allDeposits(){

return this.adminDepositService.allDeposits();

}








@Post(':id/approve')

approve(

@Param('id') id:string

){

return this.adminDepositService.approve(id);

}








@Post(':id/reject')

reject(

@Param('id') id:string

){

return this.adminDepositService.reject(id);

}



}
