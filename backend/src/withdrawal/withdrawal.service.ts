import {
Injectable,
BadRequestException,
NotFoundException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';






@Injectable()

export class WithdrawalService {



constructor(

private prisma:PrismaService

){}









async create(

userId:string,

data:any

){



const amount = Number(data.amount);







if(!amount || amount <= 0){

throw new BadRequestException(
"Invalid amount"
);

}








const user = await this.prisma.user.findUnique({

where:{

id:userId

}


});







if(!user){

throw new NotFoundException(
"User not found"
);

}








if(user.balance < amount){

throw new BadRequestException(
"Insufficient balance"
);

}









return this.prisma.$transaction(async(tx)=>{



await tx.user.update({

where:{

id:userId

},

data:{


balance:{


decrement:amount


}


}


});








const withdrawal = await tx.withdrawal.create({

data:{


user_id:userId,


amount,


method:data.method,


account:data.account,


status:"pending"


}


});








await tx.walletTransaction.create({

data:{


user_id:userId,


type:"withdrawal",


amount,


currency:"PKR",


description:"Withdrawal request created"


}


});







return withdrawal;



});



}









async myWithdrawals(

userId:string

){



return this.prisma.withdrawal.findMany({

where:{


user_id:userId


},


orderBy:{


created_at:"desc"


}


});



}



}
