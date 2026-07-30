"use client";


import {
useEffect,
useState
} from "react";


import {
useParams,
useRouter
} from "next/navigation";


import {
getTournament,
joinTournament
} from "@/services/tournament";







export default function TournamentDetailPage(){


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


const res = await getTournament(id);


setTournament(res);



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

"Join failed"

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

Loading...

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
min-h-screen
bg-black
text-white
p-6
">





<div className="
max-w-4xl
mx-auto
bg-zinc-900
border
border-zinc-700
rounded-3xl
p-8
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
md:grid-cols-2
gap-5
">





<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="text-gray-400">

Entry Fee

</p>


<p className="
text-2xl
font-bold
text-green-400
">

{tournament.entry_fee}

{" "}

{tournament.currency || ""}

</p>


</div>








<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="text-gray-400">

Reward

</p>


<p className="
text-2xl
font-bold
text-yellow-400
">

{tournament.reward || 0}

</p>


</div>








<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="text-gray-400">

Start Date

</p>


<p className="font-bold">

{
new Date(
tournament.start_date
).toLocaleDateString()
}

</p>


</div>








<div className="
bg-zinc-800
rounded-2xl
p-5
">

<p className="text-gray-400">

Start Time

</p>


<p className="font-bold">

{tournament.start_time}

</p>


</div>






</div>








<div className="
mt-8
bg-zinc-800
rounded-2xl
p-5
">

<p className="text-gray-400">

Status

</p>


<p className="
uppercase
text-blue-400
font-bold
">

{tournament.status}

</p>


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

"JOINING..."

:

"JOIN TOURNAMENT"

}

</button>








</div>





</div>

);


}
