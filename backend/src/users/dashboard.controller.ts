import {
Controller,
Get,
Req,
UseGuards
} from '@nestjs/common';



import {
DashboardService
} from './dashboard.service';



import {
JwtAuthGuard
} from '../auth/jwt.guard';






@Controller('dashboard')

export class DashboardController {



constructor(

private dashboardService:DashboardService

){}








@Get()

@UseGuards(JwtAuthGuard)

getDashboard(

@Req() req:any

){



return this.dashboardService.getDashboard(

req.user.id

);


}




}
