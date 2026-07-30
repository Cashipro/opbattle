import {
  Injectable,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';


import {
  PrismaService
} from '../prisma/prisma.service';


import * as bcrypt from 'bcrypt';


import {
  JwtService
} from '@nestjs/jwt';





@Injectable()

export class AuthService {



constructor(

private prisma:PrismaService,


private jwtService:JwtService


){}









async register(data:any){



const existingUser =

await this.prisma.user.findUnique({

where:{

email:data.email

}

});





if(existingUser){


throw new ConflictException(

"Email already exists"

);


}








const existingPubg =

await this.prisma.user.findUnique({

where:{

pubg_uid:data.pubg_uid

}

});





if(existingPubg){


throw new ConflictException(

"PUBG UID already registered"

);


}







const passwordHash =

await bcrypt.hash(

data.password,

10

);







const user =

await this.prisma.user.create({

data:{


name:data.name,


email:data.email,


password:passwordHash,


pubg_uid:data.pubg_uid,


role:"user"



}


});







return {


message:"Account Created",


userId:user.id



};



}









async login(data:any){



const user =

await this.prisma.user.findUnique({

where:{

email:data.email

}

});






if(!user){


throw new UnauthorizedException(

"Invalid Email"

);


}







const match =

await bcrypt.compare(

data.password,

user.password

);







if(!match){


throw new UnauthorizedException(

"Wrong Password"

);


}









const token =

this.jwtService.sign({

id:user.id,


email:user.email,


role:user.role


});







return {


token,


user:{


id:user.id,


name:user.name,


email:user.email,


pubg_uid:user.pubg_uid,


role:user.role



}



};



}






}
