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
  getTournament,
  joinTournament
} from "@/services/tournament";







export default function TournamentDetail(){


const params = useParams<{id:string}>();

const router = useRouter();


const id = params?.id;





const [tournament,setTournament] = useState<any>(null);

const [loading,setLoading] = useState(true);

const [joining,setJoining] = useState(false);









useEffect(()=>{


if(id){

loadTournament();

}


},[id]);









async function loadTournament(){


try{


const data = await getTournament(id);


setTournament(data);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}









async function handleJoin(){


try{


setJoining(true);


await joinTournament(id);



alert(
"Tournament joined successfully"
);



// OPEN PUBG ROOM

router.push(

`/team-room/${id}`

);



}catch(error:any){


alert(

error?.response?.data?.message ||

"Unable to join tournament"

);



}finally{


setJoining(false);


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

Loading tournament...

</div>

);


}









if(!tournament){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
">

Tournament not found

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
max-w-5xl
mx-auto
">






<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
md:p-10
">






<h1 className="
text-4xl
font-black
mb-8
">

{tournament.name}

</h1>









<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">







<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Entry Fee

</p>


<p className="
text-green-400
font-black
text-2xl
">

{tournament.entry_fee}

{" "}

{tournament.currency}

</p>


</div>









<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Reward

</p>


<p className="
text-yellow-400
font-black
text-2xl
">

{tournament.reward || 0}

</p>


</div>









<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Teams

</p>


<p className="
text-blue-400
font-black
text-2xl
">

{tournament.totalTeams || 100}

</p>


</div>









<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Players Joined

</p>


<p className="
text-green-400
font-black
text-2xl
">

{tournament.players || 0}

</p>


</div>








</div>









<button

onClick={handleJoin}

disabled={joining}

className="
mt-8
w-full
bg-green-600
hover:bg-green-700
py-4
rounded-2xl
font-black
text-lg
"

>

{

joining

?

"Joining..."

:

"JOIN TOURNAMENT"

}

</button>









<button

onClick={()=>router.push(`/team-room/${id}`)}

className="
mt-4
w-full
bg-zinc-700
hover:bg-zinc-600
py-4
rounded-2xl
font-black
"

>

🎮 OPEN PUBG ROOM

</button>








</div>







</div>






</main>






</div>


);


}
