"use client";


import {
useEffect,
useState
} from "react";


import api from "@/lib/api";







export default function AdminDeposits(){



const [deposits,setDeposits] = useState<any[]>([]);


const [loading,setLoading] = useState(true);









useEffect(()=>{

loadDeposits();

},[]);








async function loadDeposits(){


try{


const res = await api.get(
"/admin/deposits"
);


setDeposits(res.data);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}









async function approve(id:string){


try{


await api.post(
`/admin/deposits/${id}/approve`
);



alert(
"Deposit approved"
);



loadDeposits();



}catch(error){


alert(
"Approve failed"
);


}



}









async function reject(id:string){


try{


await api.post(
`/admin/deposits/${id}/reject`
);



alert(
"Deposit rejected"
);



loadDeposits();



}catch(error){


alert(
"Reject failed"
);


}



}








return (

<div className="
space-y-8
">



<h1 className="
text-4xl
font-black
">

Deposits

</h1>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
overflow-hidden
">



{

loading

?

<div className="
p-6
">

Loading...

</div>


:



deposits.length === 0

?


<div className="
p-6
text-zinc-400
">

No deposits found

</div>


:



<div className="
overflow-x-auto
">

<table className="
w-full
text-left
">


<thead className="
bg-zinc-800
">

<tr>


<th className="
p-4
">

User

</th>


<th className="
p-4
">

Email

</th>


<th className="
p-4
">

Amount

</th>


<th className="
p-4
">

Method

</th>


<th className="
p-4
">

Status

</th>


<th className="
p-4
">

Action

</th>


</tr>


</thead>





<tbody>


{

deposits.map((item)=>(


<tr

key={item.id}

className="
border-t
border-zinc-800
"

>


<td className="
p-4
font-bold
">

{item.user?.name}

</td>



<td className="
p-4
text-zinc-400
">

{item.user?.email}

</td>



<td className="
p-4
text-green-400
font-black
">

{item.amount}

</td>



<td className="
p-4
">

{item.method}

</td>



<td className="
p-4
">

<span className="
bg-zinc-800
px-3
py-1
rounded-full
">

{item.status}

</span>

</td>





<td className="
p-4
space-x-2
">


{

item.status === "pending" &&

<>


<button

onClick={()=>
approve(item.id)
}

className="
bg-green-600
px-4
py-2
rounded-xl
font-bold
"

>

Approve

</button>





<button

onClick={()=>
reject(item.id)
}

className="
bg-red-600
px-4
py-2
rounded-xl
font-bold
"

>

Reject

</button>


</>


}



</td>



</tr>


))


}



</tbody>



</table>



</div>


}



</div>






</div>

);


}
