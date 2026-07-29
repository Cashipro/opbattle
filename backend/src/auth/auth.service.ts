import {
Injectable,
UnauthorizedException,
ConflictException,
} from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';


import { JwtService } from '@nestjs/jwt';


import * as bcrypt from 'bcrypt';



import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';





@Injectable()

export class AuthService {



constructor(

private prisma: PrismaService,

private jwt: JwtService

){}





async register(data:RegisterDto){



const emailExist = await this.prisma.user.findUnique({

where:{

email:data.email

}

});



if(emailExist){

throw new ConflictException(
"Email already registered"
);

}





const pubgExist = await this.prisma.user.findUnique({

where:{

pubg_uid:data.pubg_uid

}

});



if(pubgExist){

throw new ConflictException(
"PUBG UID already registered"
);

}





const hashedPassword =
await bcrypt.hash(
data.password,
10
);





const user =
await this.prisma.user.create({

data:{


name:data.name,


email:data.email,


pubg_uid:data.pubg_uid,


password:hashedPassword,


balance:0



}


});





return {

message:"Account created successfully",

user:{


id:user.id,

name:user.name,

email:user.email,


pubg_uid:user.pubg_uid


}


};



}








async login(data:LoginDto){



const user =
await this.prisma.user.findUnique({

where:{

email:data.email

}

});




if(!user){

throw new UnauthorizedException(
"Invalid email or password"
);

}






const passwordMatch =
await bcrypt.compare(

data.password,

user.password

);





if(!passwordMatch){

throw new UnauthorizedException(
"Invalid email or password"
);

}





const token =
this.jwt.sign({

id:user.id,

email:user.email

});






return {


message:"Login successful",


token,


user:{


id:user.id,


name:user.name,


email:user.email,


pubg_uid:user.pubg_uid


}


};




}



}
