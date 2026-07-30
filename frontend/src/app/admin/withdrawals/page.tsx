"use client";

import {
useEffect,
useState
} from "react";

import api from "@/lib/api";

export default function AdminWithdrawals(){

const [withdrawals,setWithdrawals]=useState<any[]>([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{

loadWithdrawals();

},[]);

async function loadWithdrawals(){

try{

const res=await api.get("/admin/withdrawals");

setWithdrawals(res.data);

}catch(err){

console.log(err);

}finally{

setLoading(false);

}

}

async function approve(id:string){

try{

await api.post(`/admin/withdrawals/${id}/approve`);

alert("Withdrawal approved");

loadWithdrawals();

}catch{

alert("Approve failed");

}

}

async function reject(id:string){

try{

await api.post(`/admin/withdrawals/${id}/reject`);

alert("Withdrawal rejected");

loadWithdrawals();

}catch{

alert("Reject failed");

}

}

return(

<div className="space-y-8">

<h1 className="text-4xl font-black">

Withdrawals

</h1>

<div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

{

loading ?

<div className="p-6">

Loading...

</div>

:

withdrawals.length===0 ?

<div className="p-6 text-zinc-400">

No withdrawals found

</div>

:

<div className="overflow-x-auto">

<table className="w-full text-left">

<thead className="bg-zinc-800">

<tr>

<th className="p-4">

User

</th>

<th className="p-4">

Email

</th>

<th className="p-4">

Amount

</th>

<th className="p-4">

Method

</th>

<th className="p-4">

Account

</th>

<th className="p-4">

Status

</th>

<th className="p-4">

Action

</th>

</tr>

</thead>

<tbody>

{

withdrawals.map((item)=>(

<tr
key={item.id}
className="border-t border-zinc-800">

<td className="p-4 font-bold">

{item.user?.name}

</td>

<td className="p-4 text-zinc-400">

{item.user?.email}

</td>

<td className="p-4 font-black text-green-400">

{item.amount}

</td>

<td className="p-4">

{item.method}

</td>

<td className="p-4">

{item.account}

</td>

<td className="p-4">

<span className="bg-zinc-800 px-3 py-1 rounded-full">

{item.status}

</span>

</td>

<td className="p-4 space-x-2">

{

item.status==="pending" &&

<>

<button

onClick={()=>approve(item.id)}

className="bg-green-600 px-4 py-2 rounded-xl font-bold">

Approve

</button>

<button

onClick={()=>reject(item.id)}

className="bg-red-600 px-4 py-2 rounded-xl font-bold">

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
