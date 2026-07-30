"use client";

import {
useEffect,
useState
} from "react";


import {
getTournaments
} from "@/services/tournament";



import Link from "next/link";





export default function TournamentsPage(){


const [tournaments,setTournaments] = useState<any[]>([]);

const [loading,setLoading] = useState(true);







useEffect(()=>{


loadTournaments();


},[]);








async function loadTournaments(){


try{


const data = await getTournaments();


setTournaments(data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}








if(loading){


return (

<div className="min-h-screen bg-black text-white flex items-center justify-center">

Loading Tournaments...

</div>

);


}








return (

<div className="min-h-screen bg-black text-white p-6">



<h1 className="text-3xl font-bold mb-8 text-center">

PUBG Tournaments

</h1>








<div className="grid grid-cols-1 md:grid-cols-3 gap-6">



{

tournaments.map((item)=>(


<div

key={item.id}

className="
bg-zinc-900
border
border-zinc-700
rounded-2xl
p-6
shadow-xl
hover:scale-105
transition
"


>



<h2 className="text-xl font-bold mb-4">

{item.name}

</h2>






<div className="space-y-2 text-sm text-gray-300">


<p>

Entry Fee:

<span className="text-green-400 ml-2">

{item.entry_fee} {item.currency}

</span>

</p>



<p>

Start:

<span className="ml-2">

{new Date(item.start_date).toLocaleDateString()}

</span>

</p>



<p>

Time:

<span className="ml-2">

{item.start_time}

</span>

</p>



<p>

Status:

<span className="
ml-2
text-yellow-400
uppercase
">

{item.status}

</span>

</p>



</div>







<Link

href={`/tournaments/${item.id}`}

className="
block
mt-6
text-center
bg-blue-600
hover:bg-blue-700
rounded-xl
py-3
font-semibold
"

>

View Tournament

</Link>







</div>


))

}



</div>





</div>

);



}
