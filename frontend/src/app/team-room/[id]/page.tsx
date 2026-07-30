"use client";


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import {
getTeamRoom,
selectSlot,
leaveSlot
} from "@/services/tournament";







export default function TeamRoom(){


const params = useParams<{id:string}>();

const id = params?.id;





const [teams,setTeams] = useState<any[]>([]);

const [loading,setLoading] = useState(true);









useEffect(()=>{


if(id){

loadRoom();

}


},[id]);









async function loadRoom(){


try{


if(!id)return;


const data = await getTeamRoom(id);


setTeams(data);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}









async function joinSlot(slotId:string){


try{


await selectSlot(slotId);


loadRoom();



}catch(error:any){


alert(

error?.response?.data?.message ||

"Slot unavailable"

);


}



}









async function exitSlot(slotId:string){


try{


await leaveSlot(slotId);


loadRoom();



}catch(error){


console.log(error);


}



}









function TeamCard({team}:any){


return (

<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-5
">






<div className="
flex
justify-between
items-center
mb-5
">

<h2 className="
text-xl
font-black
">

{team.name}

</h2>


<span className="
text-gray-400
text-sm
">

Team {team.team_number}

</span>


</div>









<div className="
grid
grid-cols-2
gap-3
">





{

team.slots.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-xl
p-4
text-center
min-h-[120px]
flex
flex-col
justify-center
items-center
"

>





{

slot.user

?

<>

<div className="
text-3xl
">

👤

</div>


<p className="
font-bold
text-green-400
text-sm
break-all
">

{slot.user.name}

</p>


<p className="
text-xs
text-gray-400
">

{slot.user.pubg_uid}

</p>


<button

onClick={()=>exitSlot(slot.id)}

className="
mt-3
bg-red-600
px-3
py-1
rounded-lg
text-xs
font-bold
"

>

Leave

</button>


</>


:

<>

<div className="
text-3xl
">

➕

</div>


<p className="
text-gray-400
text-sm
mb-2
">

Empty Slot

</p>


<button

onClick={()=>joinSlot(slot.id)}

className="
bg-green-600
px-3
py-1
rounded-lg
text-xs
font-bold
"

>

Join

</button>


</>



}





</div>



))


}






</div>





</div>


);


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

Loading Room...

</div>

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
md:ml-64
md:p-10
md:pt-10
">






<div className="
max-w-7xl
mx-auto
">







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
mb-8
">




<h1 className="
text-3xl
md:text-5xl
font-black
">

🎮 PUBG ROOM

</h1>


<p className="
text-gray-400
mt-2
">

Select your team position

</p>


</div>









<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">






{

teams.map((team:any)=>(


<TeamCard

key={team.id}

team={team}

/>


))


}






</div>







</div>






</main>







</div>


);


}
