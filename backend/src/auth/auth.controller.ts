import {
Controller,
Post,
Body,
Get,
UseGuards
} from '@nestjs/common';


import {
AuthService
} from './auth.service';


import * as bcrypt from 'bcrypt';


import {
JwtGuard
} from './jwt.guard';


import {
CurrentUser
} from './current-user.decorator';







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









@Get('me')

@UseGuards(JwtGuard)

me(

@CurrentUser() user:any

){

return this.authService.getUser(

user.id

);

}








}
