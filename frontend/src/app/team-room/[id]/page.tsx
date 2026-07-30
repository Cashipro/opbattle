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


const data = await getTeamRoom(id);


setTeams(data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}









async function chooseSlot(slotId:string){


try{


await selectSlot(slotId);


loadRoom();



}catch(error:any){


alert(

error?.response?.data?.message ||

"Slot not available"

);


}



}









async function removeSlot(slotId:string){


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

Loading PUBG Room...

</div>

);


}









// pair teams

const pairs=[];


for(
let i=0;
i<teams.length;
i+=2
){

pairs.push([
teams[i],
teams[i+1]
]);

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
">





<div className="
max-w-7xl
mx-auto
">






<h1 className="
text-3xl
md:text-5xl
font-black
mb-8
">

🎮 PUBG Room

</h1>









<div className="
space-y-6
">






{

pairs.map((pair:any,index)=>(


<div
key={index}
className="
grid
grid-cols-1
xl:grid-cols-2
gap-6
"
>






{

pair.map((team:any)=>(


team &&

<div
key={team.id}
className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-5
"
>





<div className="
flex
justify-between
items-center
mb-5
">


<h2 className="
text-2xl
font-black
">

{team.name}

</h2>


<span className="
text-green-400
font-bold
">

#{team.team_number}

</span>


</div>








<div className="
grid
grid-cols-2
gap-4
">




{

team.slots.map((slot:any)=>(


<div
key={slot.id}
className="
bg-zinc-800
rounded-2xl
p-4
min-h-[120px]
flex
flex-col
justify-between
"
>





<div>


<p className="
text-gray-400
text-sm
">

Slot {slot.slot_number}

</p>





{

slot.user

?

<div className="
mt-3
">

<p className="
font-bold
text-green-400
">

👤 {slot.user.name}

</p>


<p className="
text-xs
text-gray-400
">

{slot.user.pubg_uid}

</p>


</div>


:

<p className="
text-gray-500
mt-4
">

Empty Slot

</p>


}



</div>








{

slot.user

?

<button

onClick={()=>removeSlot(slot.id)}

className="
bg-red-600
rounded-xl
py-2
mt-3
font-bold
"

>

Leave

</button>


:

<button

onClick={()=>chooseSlot(slot.id)}

className="
bg-green-600
rounded-xl
py-2
mt-3
font-bold
"

>

Join

</button>


}




</div>


))

}



</div>





</div>



))


}





</div>





))


}






</div>






</div>





</main>






</div>


);



}
