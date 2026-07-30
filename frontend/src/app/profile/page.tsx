"use client";


import {
useEffect,
useState
} from "react";


import Sidebar from "@/components/Sidebar";







export default function Profile(){



const [user,setUser] = useState<any>({});








useEffect(()=>{


const data =
localStorage.getItem("user");



if(data){

setUser(
JSON.parse(data)
);

}



},[]);








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

👤 Profile

</h1>








<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
md:p-8
">







<div className="
flex
items-center
gap-5
mb-8
">





<div className="
w-20
h-20
rounded-full
bg-green-600
flex
items-center
justify-center
text-3xl
font-black
">

{

user.name

?

user.name.charAt(0).toUpperCase()

:

"P"

}

</div>







<div>

<h2 className="
text-2xl
font-bold
">

{user.name || "Player"}

</h2>


<p className="
text-gray-400
">

Tournament Player

</p>


</div>







</div>









<div className="
space-y-4
">





<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="
text-gray-400
">

Email

</p>


<p className="
font-bold
break-all
">

{user.email || "-"}

</p>


</div>








<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="
text-gray-400
">

PUBG UID

</p>


<p className="
font-bold
">

{user.pubg_uid || "-"}

</p>


</div>








<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="
text-gray-400
">

Balance

</p>


<p className="
font-bold
text-green-400
text-2xl
">

{user.balance || 0}

</p>


</div>







</div>








<button

className="
mt-8
w-full
bg-blue-600
py-4
rounded-xl
font-black
hover:bg-blue-700
"

>

Edit Profile

</button>








</div>








</div>





</main>






</div>

);


}
