"use client";

import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import api from "@/lib/api";







export default function TeamRoomPage(){


const params = useParams();

const id = params.id as string;



const [teams,setTeams] = useState<any[]>([]);

const [loading,setLoading] = useState(true);







useEffect(()=>{


if(id){

loadRoom();

}


},[id]);








async function loadRoom(){


try{


const res = await api.get(

`/tournaments/${id}/team-room`

);


setTeams(res.data);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}








async function selectSlot(slotId:string){


try{


await api.post(

"/tournaments/team/select-slot",

{

slotId

}

);



alert("Slot selected");


loadRoom();



}catch(error:any){


alert(

error?.response?.data?.message ||

"Slot select failed"

);



}



}









if(loading){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
">

Loading Team Room...

</div>

);


}








return (

<div className="
min-h-screen
bg-black
text-white
p-6
">





<h1 className="
text-3xl
font-bold
text-center
mb-8
">

PUBG TEAM ROOM

</h1>







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-6
max-w-5xl
mx-auto
">





{

teams.map((team)=>(



<div

key={team.id}

className="
bg-zinc-900
border
border-zinc-700
rounded-3xl
p-6
shadow-xl
"

>



<h2 className="
text-xl
font-bold
mb-4
text-blue-400
">

#{team.team_number} {team.name}

</h2>







<div className="space-y-3">


{

team.slots.map((slot:any)=>(



<button

key={slot.id}

disabled={!!slot.user}

onClick={()=>selectSlot(slot.id)}

className={`

w-full

rounded-xl

p-4

text-left

border

${

slot.user

?

"bg-green-900 border-green-600"

:

"bg-zinc-800 border-zinc-600 hover:bg-zinc-700"

}

`}

>




<div className="font-bold">


Slot {slot.slot_number}

</div>





{

slot.user

?

<div className="text-sm text-gray-300">

{slot.user.name}

<br/>

PUBG ID:
{slot.user.pubg_uid}

</div>


:

<div className="text-gray-400">

Empty - Select Slot

</div>


}




</button>



))

}



</div>







</div>



))

}



</div>





</div>

);



}
