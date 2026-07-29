"use client";


import {
useEffect,
useState
} from "react";


import api from "@/lib/api";


import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";





export default function MyTournaments(){



const [data,setData]=useState<any[]>([]);





useEffect(()=>{


load();


},[]);






async function load(){


const user =
JSON.parse(

localStorage.getItem("user") || "{}"

);



const res =
await api.get(

`/tournaments/user/${user.id}/my`

);



setData(res.data);



}







return(

<>


<Navbar />



<main className="min-h-screen p-6">



<h1 className="text-4xl font-black mb-8">

My Tournaments

</h1>





<div className="grid md:grid-cols-2 gap-6">





{

data.map((item)=>(



<div

key={item.id}

className="game-card p-6"

>



<h2 className="text-2xl font-bold">

{item.tournament.name}

</h2>



<p>

Team:

<span className="text-[#00ff84] ml-2">

{item.team.team_number}

</span>

</p>




<p>

Team Name:

{item.team.team_name}

</p>





<p>

Slot:

{item.slot_number}

</p>





<p>

Room ID:

{item.tournament.room_id || "Not Added"}

</p>




<p>

Room Password:

{item.tournament.room_password || "Not Added"}

</p>





</div>



))

}





</div>






</main>



<Footer />


</>

);


}
