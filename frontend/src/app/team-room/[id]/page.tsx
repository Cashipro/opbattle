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









async function joinSlot(slotId:string){


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








async function removeSlot(){


try{


await leaveSlot();


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
md:p-10
md:pt-10
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

🎮 PUBG Team Room

</h1>









<div className="
grid
grid-cols-1
lg:grid-cols-2
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
p-5
"

>





<h2 className="
text-2xl
font-black
mb-5
text-green-400
">

{team.name}

</h2>







<div className="
grid
grid-cols-2
gap-4
">






{

team.slots.map((slot:any)=>(



<button

key={slot.id}

onClick={()=>{

if(!slot.user){

joinSlot(slot.id);

}

}}

className={`
rounded-2xl
p-4
text-center
border
transition

${

slot.user

?

"bg-zinc-800 border-green-600"

:

"bg-black border-zinc-700 hover:border-green-400"

}

`}

>





<div className="
text-3xl
">

{

slot.user

?

"👤"

:

"➕"

}

</div>







<p className="
font-bold
mt-2
">

Slot {slot.slot_number}

</p>








<p className="
text-sm
text-gray-400
break-all
">

{

slot.user

?

slot.user.name

:

"Empty"

}

</p>





</button>



))


}





</div>






</div>



))


}



</div>









<div className="
mt-8
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-5
text-center
">

<button

onClick={removeSlot}

className="
bg-red-600
px-8
py-3
rounded-xl
font-black
"

>

Leave Team

</button>


</div>






</div>





</main>




</div>


);


}
