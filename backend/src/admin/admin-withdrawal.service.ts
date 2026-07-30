import {
Injectable,
NotFoundException
} from '@nestjs/common';


import {
PrismaService
} from '../prisma/prisma.service';







@Injectable()

export class AdminWithdrawalService {



constructor(

private prisma:PrismaService

){}









async allWithdrawals(){



return this.prisma.withdrawal.findMany({

include:{


user:{


select:{


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



const withdrawal = await this.prisma.withdrawal.findUnique({

where:{

id

}

});






if(!withdrawal){

throw new NotFoundException(
"Withdrawal not found"
);

}








if(withdrawal.status==="approved"){

return {

message:"Already approved"

};

}









return this.prisma.$transaction(async(tx)=>{



const updated = await tx.withdrawal.update({

where:{

id

},


data:{


status:"approved"


}


});








await tx.walletTransaction.create({

data:{


user_id:withdrawal.user_id,


type:"withdrawal_approved",


amount:withdrawal.amount,


currency:"PKR",


description:"Withdrawal approved"


}


});







return {

message:"Withdrawal approved",

updated

};


});



}









async reject(

id:string

){



const withdrawal = await this.prisma.withdrawal.findUnique({

where:{

id

}

});







if(!withdrawal){

throw new NotFoundException(
"Withdrawal not found"
);

}







return this.prisma.withdrawal.update({

where:{

id

},


data:{


status:"rejected"


}


});


}



}
