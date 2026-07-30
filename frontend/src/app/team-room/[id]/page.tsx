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









async function join(slotId:string){


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









async function leave(slotId:string){


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

🎮 PUBG TEAM ROOM

</h1>








<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-5
mb-8
">




<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
text-center
">


<div>
<p className="text-gray-400">
Room ID
</p>
<p className="font-bold text-green-400">
1729559
</p>
</div>


<div>
<p className="text-gray-400">
Password
</p>
<p className="font-bold">
None
</p>
</div>


<div>
<p className="text-gray-400">
Players
</p>
<p className="font-bold">
{teams.length * 4}/400
</p>
</div>


<div>
<p className="text-gray-400">
Mode
</p>
<p className="font-bold">
Squad
</p>
</div>



</div>



</div>









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
">

{team.name}

</h2>









<div className="
grid
grid-cols-2
sm:grid-cols-4
gap-3
">





{


team.slots?.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-xl
p-4
text-center
min-h-[140px]
flex
flex-col
justify-between
"

>







<div className="
text-4xl
">

{

slot.user

?

"👑"

:

"👤"

}

</div>







<p className="
font-bold
text-sm
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







{

slot.user

?

(

<button

onClick={()=>leave(slot.id)}

className="
bg-red-600
rounded-lg
py-2
text-xs
font-bold
"

>

Leave

</button>

)

:

(

<button

onClick={()=>join(slot.id)}

className="
bg-green-600
rounded-lg
py-2
text-xs
font-bold
"

>

Join

</button>

)



}








</div>



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
