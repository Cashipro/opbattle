import {
Controller,
Get
} from '@nestjs/common';


import {
AdminStatsService
} from './admin-stats.service';






@Controller('admin/stats')

export class AdminStatsController {



constructor(

private adminStatsService: AdminStatsService

){}





@Get()

getStats(){


return this.adminStatsService.getStats();


}



}
