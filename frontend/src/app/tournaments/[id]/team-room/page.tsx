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
  selectSlot
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








<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-5
mb-8
">


<h1 className="
text-3xl
font-black
">

🎮 PUBG Tournament Room

</h1>


<p className="
text-gray-400
mt-2
">

Select your squad position

</p>


</div>









<div className="
grid
grid-cols-1
xl:grid-cols-2
gap-6
">







{

teams.map((team:any,index:number)=>(



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
text-xl
font-black
text-green-400
">

{team.name}

</h2>


<span className="
text-gray-400
">

#{team.team_number}

</span>


</div>









<div className="
grid
grid-cols-2
sm:grid-cols-4
gap-3
">






{

team.slots?.map((slot:any)=>(



<button

key={slot.id}

onClick={()=>{

if(!slot.user){

chooseSlot(slot.id)

}

}}

disabled={!!slot.user}

className={`
rounded-2xl
p-4
min-h-[120px]
border
transition

${

slot.user

?

"bg-zinc-800 border-zinc-700 cursor-not-allowed"

:

"bg-black border-green-500 hover:bg-green-900"

}

`}

>







<div className="
text-3xl
mb-2
">

{

slot.user

?

(slot.slot_number===1 ? "👑":"👤")

:

"➕"

}


</div>






<p className="
font-bold
text-sm
">

Slot {slot.slot_number}

</p>






<p className="
text-xs
text-gray-400
mt-2
truncate
">

{

slot.user

?

slot.user.name

:

"Available"

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








</div>






</main>






</div>


);


}
