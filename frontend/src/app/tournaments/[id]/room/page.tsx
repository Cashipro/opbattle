"use client";


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import api from "@/lib/api";



import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";





export default function TeamRoomPage(){



const params = useParams();


const tournamentId =
params.id as string;




const [teams,setTeams]=useState<any[]>([]);



const [loading,setLoading]=useState(true);







useEffect(()=>{


loadRoom();


},[]);








async function loadRoom(){


try{


const res = await api.get(

`/tournaments/${tournamentId}/room`

);



setTeams(res.data);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);


}



}









async function selectSlot(slotId:string){



try{



await api.post(

`/tournaments/${tournamentId}/select-slot`,

{

slotId

}

);



loadRoom();



}

catch(error:any){



alert(

error.response?.data?.message ||

"Slot selection failed"

);


}




}








return(

<>


<Navbar />



<main className="min-h-screen p-5 md:p-10">





<h1 className="text-4xl font-black mb-8">

PUBG Team Room

</h1>






{

loading &&

<p>

Loading Room...

</p>

}







<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">





{

teams.map((team)=>(



<div

key={team.id}

className="game-card p-5"

>





<h2 className="text-xl font-black text-[#00ff84]">

Team {team.team_number}

</h2>





<p className="text-gray-400 mb-4">

{team.team_name}

</p>








<div className="space-y-3">





{

team.slots.map((slot:any)=>(



<div

key={slot.id}

className="bg-black border border-gray-800 rounded-xl p-3 flex items-center justify-between"

>





{

slot.user ?



<div className="flex items-center gap-3">



<div className="w-10 h-10 rounded-full bg-[#00ff84] text-black flex items-center justify-center font-bold">


{slot.user.name?.charAt(0)}


</div>




<div>


<p className="font-bold">

{slot.user.name}

</p>


<p className="text-xs text-gray-400">

Slot {slot.slot_number}

</p>


</div>



</div>



:



<>


<div>


<p className="text-gray-400">

Empty Slot

</p>


<p className="text-xs">

Slot {slot.slot_number}

</p>


</div>





<button

onClick={()=>selectSlot(slot.id)}

className="text-[#00ff84] font-bold"

>

Select

</button>



</>



}





</div>



))


}




</div>






</div>



))


}




</div>







</main>



<Footer />



</>


);


}
