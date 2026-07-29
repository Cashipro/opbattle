"use client";


import {
useEffect,
useState
} from "react";



import {
useRouter
} from "next/navigation";



import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";





export default function Dashboard(){



const router=useRouter();



const [user,setUser]=useState<any>(null);





useEffect(()=>{


const data =
localStorage.getItem("user");



if(!data){


router.push("/login");


return;


}



setUser(
JSON.parse(data)
);



},[]);







if(!user){

return null;

}






return(

<>


<Navbar />



<main className="min-h-screen p-6 md:p-10">



<h1 className="text-3xl font-black">

Welcome

<span className="text-[#00ff84] ml-2">

{user.name}

</span>

</h1>





<div className="grid md:grid-cols-3 gap-6 mt-10">





<div className="game-card p-6">


<p className="text-gray-400">

Email

</p>


<h2 className="text-xl font-bold">

{user.email}

</h2>


</div>






<div className="game-card p-6">


<p className="text-gray-400">

PUBG UID

</p>


<h2 className="text-xl font-bold">

{user.pubg_uid}

</h2>


</div>







<div className="game-card p-6">


<p className="text-gray-400">

Balance

</p>


<h2 className="text-2xl font-black text-[#00ff84]">

$0.00

</h2>


</div>





</div>








<div className="game-card p-8 mt-10">


<h2 className="text-2xl font-black">

My Tournament

</h2>


<p className="text-gray-400 mt-3">

No tournament joined yet.

</p>



</div>







</main>



<Footer />



</>

);


}
