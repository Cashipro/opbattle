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

const [myTeam,setMyTeam] = useState<string | null>(null);









useEffect(()=>{


if(id){

load();

}


},[id]);









async function load(){


try{


const data = await getTeamRoom(id);


setTeams(data);





const current = data.find((team:any)=>

team.slots.some((slot:any)=>slot.user)

);



if(current){

setMyTeam(current.id);

}



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

"Slot unavailable"

);


}


}









async function leave(slotId:string){


await leaveSlot(slotId);


load();

}









function TeamCard({team}:any){


return (


<div

className={`
rounded-3xl
p-5
border
transition

${
myTeam===team.id

?

"border-green-500 bg-green-500/10"

:

"border-zinc-800 bg-zinc-900"

}

`}

>



<div className="
flex
justify-between
mb-5
">


<h2 className="
font-black
text-xl
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
min-h-[130px]
text-center
flex
flex-col
items-center
justify-center
"

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







{

slot.user

?

<>

<p className="
font-bold
text-green-400
text-sm
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

onClick={()=>leave(slot.id)}

className="
mt-2
bg-red-600
px-3
py-1
rounded-lg
text-xs
"

>

Leave

</button>

</>


:

<button

onClick={()=>join(slot.id)}

className="
mt-2
bg-green-600
px-4
py-2
rounded-lg
font-bold
text-sm
"

>

Join Slot

</button>



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

Loading PUBG Room...

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
">

Choose your squad position

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
