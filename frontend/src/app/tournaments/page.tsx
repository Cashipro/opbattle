"use client";


import {
useEffect,
useState
} from "react";


import api from "@/lib/api";


import Link from "next/link";



import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";





export default function TournamentsPage(){



const [tournaments,setTournaments]=useState<any[]>([]);


const [loading,setLoading]=useState(true);






useEffect(()=>{


loadTournaments();


},[]);






async function loadTournaments(){



try{


const res =
await api.get("/tournaments");



setTournaments(

res.data

);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);


}


}






return(

<>


<Navbar />



<main className="min-h-screen p-6 md:p-10">



<h1 className="text-4xl font-black mb-8">

PUBG Tournaments

</h1>







{

loading &&

<p>

Loading tournaments...

</p>

}








<div className="grid md:grid-cols-3 gap-6">





{

tournaments.map((tour)=>(



<div

key={tour.id}

className="game-card p-6"

>





<h2 className="text-2xl font-black">

{tour.name}

</h2>





<div className="mt-5 space-y-2 text-gray-300">



<p>

Entry Fee:

<span className="text-[#00ff84] ml-2">

${tour.entry_fee}

</span>

</p>




<p>

Prize Pool:

<span className="text-[#00ff84] ml-2">

${tour.prize_pool}

</span>

</p>




<p>

Start Date:

{new Date(

tour.start_date

).toLocaleDateString()}

</p>




<p>

Start Time:

{tour.start_time}

</p>




<p>

Status:

<span className="text-[#00ff84] ml-2">

{tour.status}

</span>

</p>




</div>






<Link

href={`/tournaments/${tour.id}`}

>


<button

className="btn-primary w-full mt-6"

>

View Tournament

</button>



</Link>







</div>



))

}




</div>







{

!loading && tournaments.length===0 &&


<div className="game-card p-8">


<p>

No tournaments available.

</p>


</div>


}




</main>



<Footer />



</>

);



}
