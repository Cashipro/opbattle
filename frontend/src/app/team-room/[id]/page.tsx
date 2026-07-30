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



const params = useParams();


const id = params.id as string;



const [teams,setTeams] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);








async function load(){


try{


const data =
await getTeamRoom(id);


setTeams(data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}








async function join(slotId:string){


try{


await selectSlot(slotId);


load();



}catch(error:any){


alert(

error?.response?.data?.message ||

"Unable to select slot"

);



}



}








async function leave(slotId:string){


try{


await leaveSlot(slotId);


load();



}catch(error){


console.log(error);


}



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
md:pt-10
">






<div className="
max-w-7xl
mx-auto
">







<h1 className="
text-3xl
md:text-4xl
font-black
mb-8
">

👥 Team Room

</h1>









{

loading

?

<div className="
text-gray-400
">

Loading teams...

</div>


:


<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">


{

teams.map((team:any)=>(



<div

key={team.id}

className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
"

>



<h2 className="
text-2xl
font-bold
mb-5
">

{team.name}

</h2>








<div className="
space-y-3
">

{

team.slots.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-xl
p-4
flex
justify-between
items-center
"

>



<div>


<p className="
font-bold
">

Slot {slot.slot_number}

</p>



{

slot.user

?

<p className="
text-green-400
text-sm
">

{slot.user.name}

</p>


:

<p className="
text-gray-400
text-sm
">

Empty

</p>

}



</div>









{

slot.user

?

<button

onClick={()=>leave(slot.id)}

className="
bg-red-600
px-4
py-2
rounded-lg
text-sm
font-bold
"

>

Leave

</button>


:

<button

onClick={()=>join(slot.id)}

className="
bg-green-600
px-4
py-2
rounded-lg
text-sm
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



}





</div>





</main>






</div>

);


}
