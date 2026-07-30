import {
Injectable,
NotFoundException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';






@Injectable()

export class AdminDepositService {



constructor(

private prisma:PrismaService

){}








async allDeposits(){


return this.prisma.deposit.findMany({

include:{


user:{


select:{


id:true,

name:true,

email:true


}


}


},


orderBy:{


created_at:"desc"


}


});


}









async approve(

id:string

){



const deposit = await this.prisma.deposit.findUnique({

where:{


id


}


});







if(!deposit){

throw new NotFoundException(
"Deposit not found"
);

}






if(deposit.status === "approved"){

return {

message:"Already approved"

};

}







const result = await this.prisma.$transaction([



this.prisma.deposit.update({

where:{id},

data:{


status:"approved"


}


}),







this.prisma.user.update({

where:{


id:deposit.user_id


},


data:{


balance:{


increment:deposit.amount


}


}


}),







this.prisma.walletTransaction.create({

data:{


user_id:deposit.user_id,


type:"deposit",


amount:deposit.amount,


currency:"PKR",


description:"Deposit approved"


}


})



]);







return {

message:"Deposit approved",

result

};



}









async reject(

id:string

){



const deposit = await this.prisma.deposit.findUnique({

where:{id}

});





if(!deposit){

throw new NotFoundException(
"Deposit not found"
);

}





return this.prisma.deposit.update({

where:{id},


data:{


status:"rejected"


}


});


}



}
