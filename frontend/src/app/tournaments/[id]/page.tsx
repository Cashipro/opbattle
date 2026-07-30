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



alert("Tournament joined successfully");



router.push("/my-tournaments");



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

<div className="min-h-screen bg-black text-white flex items-center justify-center">

Loading...

</div>

);


}







if(!tournament){


return (

<div className="min-h-screen bg-black text-white flex items-center justify-center">

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
max-w-3xl
mx-auto
bg-zinc-900
border
border-zinc-700
rounded-3xl
p-8
shadow-2xl
">






<h1 className="
text-3xl
font-bold
mb-6
">

{tournament.name}

</h1>








<div className="space-y-4 text-gray-300">



<div className="
bg-zinc-800
rounded-xl
p-4
">

Entry Fee:

<span className="text-green-400 ml-2 font-bold">

{tournament.entry_fee} {tournament.currency}

</span>

</div>







<div className="
bg-zinc-800
rounded-xl
p-4
">

Start Date:

<span className="ml-2">

{new Date(
tournament.start_date
).toLocaleDateString()}

</span>

</div>







<div className="
bg-zinc-800
rounded-xl
p-4
">

Start Time:

<span className="ml-2">

{tournament.start_time}

</span>

</div>







<div className="
bg-zinc-800
rounded-xl
p-4
">

Status:

<span className="
ml-2
text-yellow-400
uppercase
">

{tournament.status}

</span>

</div>







{
tournament.reward &&
<div className="
bg-zinc-800
rounded-xl
p-4
">

Reward:

<span className="
ml-2
text-blue-400
font-bold
">

{tournament.reward}

</span>

</div>
}



</div>









<button

onClick={handleJoin}

disabled={joining}

className="
w-full
mt-8
bg-green-600
hover:bg-green-700
rounded-xl
py-4
font-bold
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

);


}
