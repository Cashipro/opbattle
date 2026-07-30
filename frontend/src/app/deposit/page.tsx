"use client";


import {
useState
} from "react";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";






export default function Deposit(){


const [amount,setAmount] = useState("");

const [method,setMethod] = useState("");

const [loading,setLoading] = useState(false);









const paymentDetails = {

"EasyPaisa / JazzCash":

"03455555505",


"Bank Al Habib":

"01350981002414016"


};









async function submit(){


if(!amount || !method){


alert(
"Please fill all fields"
);


return;


}




try{


setLoading(true);



await api.post(

"/deposit/create",

{


amount:Number(amount),


method


}


);





alert(

"Deposit request submitted"

);





setAmount("");

setMethod("");





}catch(error:any){



alert(

error?.response?.data?.message ||

"Deposit failed"

);



}finally{


setLoading(false);


}



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

onChange={(e)=>
setAmount(e.target.value)
}

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

Payment Method

</label>




<select

value={method}

onChange={(e)=>
setMethod(e.target.value)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

>



<option value="">

Select Method

</option>


<option value="EasyPaisa / JazzCash">

EasyPaisa / JazzCash

</option>


<option value="Bank Al Habib">

Bank Al Habib

</option>


</select>


</div>









{

method &&


<div className="
bg-zinc-800
rounded-xl
p-5
">

<p className="
text-gray-400
mb-2
">

Send Payment To:

</p>


<p className="
text-green-400
font-black
text-lg
">

{paymentDetails[method as keyof typeof paymentDetails]}

</p>



<p className="
text-gray-400
mt-3
">

Account Name:

<span className="
text-white
font-bold
">

Kashif Iqbal

</span>

</p>


</div>


}









<button

onClick={submit}

disabled={loading}

className="
w-full
bg-green-600
hover:bg-green-700
py-4
rounded-xl
font-black
"

>

{

loading

?

"Submitting..."

:

"Submit Deposit"

}


</button>








</div>







</div>






</main>





</div>

);


}
