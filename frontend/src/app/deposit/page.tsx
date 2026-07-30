"use client";


import {
useState
} from "react";


import Sidebar from "@/components/Sidebar";






export default function Deposit(){



const [amount,setAmount] = useState("");

const [network,setNetwork] = useState("");








const walletAddress =
network === "TRC20"

?
"TXXXXXXXXXXXXXXXXXXXX"

:

network === "BEP20"

?

"0xXXXXXXXXXXXXXXXX"

:

"";








function submit(){


if(!amount || !network){

alert(
"Please fill all fields"
);

return;

}



alert(
"Deposit request submitted"
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
max-w-xl
mx-auto
">






<h1 className="
text-3xl
md:text-4xl
font-black
mb-8
">

💰 Deposit

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

value={amount}

onChange={(e)=>setAmount(e.target.value)}

type="number"

placeholder="Enter amount"

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









{

walletAddress &&

<div className="
bg-zinc-800
rounded-xl
p-4
break-all
">

<p className="
text-gray-400
mb-2
">

Send USDT To:

</p>


<p className="
font-bold
text-green-400
">

{walletAddress}

</p>


</div>

}









<button

onClick={submit}

className="
w-full
bg-green-600
py-4
rounded-xl
font-black
hover:bg-green-700
"

>

Submit Deposit

</button>








</div>








</div>





</main>






</div>

);


}
