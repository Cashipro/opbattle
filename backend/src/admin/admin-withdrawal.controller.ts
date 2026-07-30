import {
Controller,
Get,
Post,
Param
} from '@nestjs/common';



import {
AdminWithdrawalService
} from './admin-withdrawal.service';








@Controller('admin/withdrawals')

export class AdminWithdrawalController {



constructor(

private adminWithdrawalService: AdminWithdrawalService

){}









@Get()

all(){


return this.adminWithdrawalService.allWithdrawals();


}









@Post(':id/approve')

approve(

@Param('id') id:string

){


return this.adminWithdrawalService.approve(

id

);


}









@Post(':id/reject')

reject(

@Param('id') id:string

){


return this.adminWithdrawalService.reject(

id

);


}



}
