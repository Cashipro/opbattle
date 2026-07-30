"use client";


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import {
getTeamRoom,
selectSlot,
leaveSlot
} from "@/services/tournament";






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


const res = await getTeamRoom(id);


setTeams(res);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}








async function handleJoin(slotId:string){


try{


await selectSlot(slotId);


alert("Slot selected successfully");


loadRoom();



}catch(error:any){


alert(

error?.response?.data?.message ||

"Slot selection failed"

);


}



}








async function handleLeave(slotId:string){


try{


await leaveSlot(slotId);


loadRoom();



}catch(error){


console.log(error);


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
font-black
text-center
mb-8
">

🔥 PUBG TEAM ROOM

</h1>







<div className="
grid
md:grid-cols-2
gap-6
max-w-6xl
mx-auto
">





{

teams.map((team:any)=>(



<div

key={team.id}

className="
bg-zinc-900
border
border-zinc-700
rounded-3xl
p-6
"

>



<h2 className="
text-2xl
font-bold
text-blue-400
mb-5
">

#{team.team_number} {team.name}

</h2>







<div className="space-y-3">


{

team.slots.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-xl
p-4
"

>



<div className="
flex
justify-between
items-center
">





<div>


<p className="font-bold">

Slot {slot.slot_number}

</p>






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

<div className="text-gray-500">

Empty Slot

</div>


}



</div>









{

slot.user

?

<button

onClick={()=>handleLeave(slot.id)}

className="
bg-red-600
px-4
py-2
rounded-lg
"

>

Leave

</button>


:

<button

onClick={()=>handleJoin(slot.id)}

className="
bg-green-600
px-4
py-2
rounded-lg
"

>

Join

</button>


}





</div>





</div>



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
