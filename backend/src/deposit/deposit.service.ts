import {
Injectable,
BadRequestException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';





@Injectable()

export class DepositService {



constructor(

private prisma:PrismaService

){}








async create(

userId:string,

data:any

){



const amount = Number(data.amount);


const method = data.method;





if(!amount || amount <= 0){

throw new BadRequestException(
"Invalid amount"
);

}





if(!method){

throw new BadRequestException(
"Payment method required"
);

}







return this.prisma.deposit.create({

data:{


user_id:userId,


amount,


method,


status:"pending"


}


});



}









async myDeposits(

userId:string

){



return this.prisma.deposit.findMany({

where:{


user_id:userId


},


orderBy:{


created_at:"desc"


}


});


}



}
