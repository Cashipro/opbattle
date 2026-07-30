"use client";


import {
useEffect,
useState
} from "react";


import {
useParams,
useRouter
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import {
getTeamRoom,
selectSlot
} from "@/services/tournament";








export default function TeamRoom(){


const params = useParams<{id:string}>();

const router = useRouter();


const id = params?.id;





const [teams,setTeams] = useState<any[]>([]);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");









useEffect(()=>{


if(id){

loadRoom();

}


},[id]);









async function loadRoom(){


try{


const data = await getTeamRoom(id);


setTeams(data);



}catch(err:any){


setError(

err?.response?.data?.message ||

"You cannot access this room"

);



}finally{


setLoading(false);


}



}









async function joinSlot(slotId:string){


try{


await selectSlot(slotId);


loadRoom();



}catch(err:any){


alert(

err?.response?.data?.message ||

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

Loading room...

</div>

);


}









if(error){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
p-5
">


<div className="
bg-zinc-900
border
border-red-600
rounded-3xl
p-8
text-center
">


<h1 className="
text-3xl
font-black
mb-4
">

🚫 Access Denied

</h1>


<p className="
text-gray-400
">

{error}

</p>


<button

onClick={()=>router.push("/tournaments")}

className="
mt-6
bg-green-600
px-6
py-3
rounded-xl
font-bold
"

>

Back To Tournaments

</button>



</div>



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


<h1 className="
text-4xl
font-black
mb-8
">

🎮 PUBG TEAM ROOM

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
text-xl
font-black
mb-5
">

{team.name}

</h2>





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

<p className="
text-green-400
font-bold
text-sm
">

{slot.user.name}

</p>


:

<button

onClick={()=>joinSlot(slot.id)}

className="
bg-green-600
px-3
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




</div>


</main>


</div>

);


}
