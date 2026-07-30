import {
Controller,
Get,
UseGuards
} from '@nestjs/common';



import {
DashboardService
} from './dashboard.service';



import {
JwtGuard
} from '../auth/jwt.guard';



import {
CurrentUser
} from '../auth/current-user.decorator';






@Controller('dashboard')

export class DashboardController {



constructor(

private dashboardService:DashboardService

){}









@Get('profile')

@UseGuards(JwtGuard)

profile(

@CurrentUser() user:any

){

return this.dashboardService.getProfile(

user.id

);

}








@Get('my-tournaments')

@UseGuards(JwtGuard)

myTournaments(

@CurrentUser() user:any

){

return this.dashboardService.getMyTournaments(

user.id

);

}









@Get('matches')

@UseGuards(JwtGuard)

matches(

@CurrentUser() user:any

){

return this.dashboardService.getMyMatches(

user.id

);

}





}
