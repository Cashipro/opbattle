"use client";


import {
useState
} from "react";


import Sidebar from "@/components/Sidebar";







export default function Withdraw(){



const [amount,setAmount] = useState("");

const [network,setNetwork] = useState("");

const [wallet,setWallet] = useState("");








function submit(){


if(!amount || !network || !wallet){


alert(
"Please fill all fields"
);


return;


}



alert(
"Withdrawal request submitted"
);



}








return (

<div className="
flex
min-h-screen
bg-black
text-white
">






<Sidebar />








<main className="
flex-1
p-4
pt-20
md:p-10
md:pt-10
">






<div className="
max-w-3xl
mx-auto
">





<h1 className="
text-3xl
md:text-4xl
font-black
mb-8
">

💸 Withdraw

</h1>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
space-y-5
">








<div>

<label className="
text-gray-400
block
mb-2
">

Amount

</label>


<input

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

placeholder="Enter withdrawal amount"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

 />

</div>









<div>

<label className="
text-gray-400
block
mb-2
">

Network

</label>


<select

value={network}

onChange={(e)=>setNetwork(e.target.value)}

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

>


<option value="">

Select Network

</option>


<option value="TRC20">

USDT TRC20

</option>


<option value="BEP20">

USDT BEP20

</option>


</select>


</div>









<div>

<label className="
text-gray-400
block
mb-2
">

Wallet Address

</label>


<input

value={wallet}

onChange={(e)=>setWallet(e.target.value)}

placeholder="Enter wallet address"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

 />

</div>









<button

onClick={submit}

className="
w-full
bg-red-600
py-4
rounded-xl
font-black
hover:bg-red-700
transition
"

>

Request Withdrawal

</button>









</div>








<h2 className="
text-2xl
font-bold
mt-10
mb-5
">

Withdrawal History

</h2>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
overflow-x-auto
">





<table className="
w-full
min-w-[600px]
">

<thead>

<tr className="
text-gray-400
border-b
border-zinc-700
">

<th className="p-3 text-left">
Amount
</th>

<th className="p-3 text-left">
Network
</th>

<th className="p-3 text-left">
Status
</th>

<th className="p-3 text-left">
Date
</th>

</tr>

</thead>



<tbody>


<tr>

<td className="p-3">
-
</td>

<td className="p-3">
-
</td>

<td className="p-3 text-yellow-400">
No Data
</td>

<td className="p-3">
-
</td>

</tr>


</tbody>


</table>





</div>








</div>





</main>






</div>

);


}
