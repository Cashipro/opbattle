import {
Controller,
Post,
Body,
Get
} from '@nestjs/common';


import {
AuthService
} from './auth.service';


import * as bcrypt from 'bcrypt';







@Controller('auth')

export class AuthController {



constructor(

private authService:AuthService

){}









@Post('register')

register(

@Body() body:any

){

return this.authService.register(

body

);

}









@Post('login')

login(

@Body() body:any

){

return this.authService.login(

body

);

}









@Get('generate-hash')

generateHash(){

return bcrypt.hash(
"Gateway297",
10
);

}





}
