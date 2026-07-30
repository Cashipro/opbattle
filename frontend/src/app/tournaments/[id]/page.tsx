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


const params = useParams();

const router = useRouter();


const id = params.id as string;





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


const data =
await getTournament(id);


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



router.push(
"/my-tournaments"
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
md:pt-10
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
text-3xl
md:text-5xl
font-black
mb-8
">

{tournament.name}

</h1>








<div className="
grid
grid-cols-1
sm:grid-cols-2
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


<h2 className="
text-2xl
font-bold
text-green-400
mt-2
">

{tournament.entry_fee}

{" "}

{tournament.currency || ""}

</h2>


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


<h2 className="
text-2xl
font-bold
text-yellow-400
mt-2
">

{tournament.reward}

</h2>


</div>








<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Start Date

</p>


<h2 className="
font-bold
mt-2
">

{
new Date(
tournament.start_date
).toLocaleDateString()
}

</h2>


</div>








<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Start Time

</p>


<h2 className="
font-bold
mt-2
">

{tournament.start_time}

</h2>


</div>








</div>









<div className="
mt-6
bg-zinc-800
rounded-2xl
p-5
">

<p className="
text-gray-400
">

Tournament Status

</p>


<h2 className="
uppercase
font-bold
text-blue-400
mt-2
">

{tournament.status}

</h2>


</div>








<button

onClick={handleJoin}

disabled={joining}

className="
w-full
mt-8
bg-green-600
hover:bg-green-700
py-4
rounded-2xl
font-black
text-lg
disabled:opacity-50
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








</div>






</div>






</main>






</div>

);


}
