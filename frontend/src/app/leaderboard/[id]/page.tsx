"use client";

import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import api from "@/lib/api";







export default function LeaderboardPage(){


const params = useParams();

const id = params.id as string;



const [ranking,setRanking] = useState<any[]>([]);

const [loading,setLoading] = useState(true);







useEffect(()=>{


if(id){

loadRanking();

}


},[id]);








async function loadRanking(){


try{


const res = await api.get(

`/tournaments/${id}/result-board`

);


setRanking(res.data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


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

Loading Leaderboard...

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
max-w-5xl
mx-auto
">





<h1 className="
text-3xl
font-bold
text-center
mb-8
">

🏆 RESULT BOARD

</h1>









<div className="
space-y-4
">





{

ranking.map((team:any,index)=>(



<div

key={team.team_id}

className={`
rounded-2xl
border
p-5
flex
items-center
justify-between
bg-zinc-900
border-zinc-700
${

index===0

?

"shadow-xl shadow-yellow-500/20"

:

""

}

`}

>



<div>


<h2 className="
text-xl
font-bold
">

#{team.team_number} {team.team_name}

</h2>



<p className="
text-gray-400
">

Rank: {team.rank}

</p>



</div>







<div className="
grid
grid-cols-2
gap-6
text-center
">





<div>

<p className="
text-gray-400
text-sm
">

Kills

</p>


<p className="
text-green-400
font-bold
text-xl
">

{team.kills}

</p>


</div>







<div>

<p className="
text-gray-400
text-sm
">

Points

</p>


<p className="
text-blue-400
font-bold
text-xl
">

{team.points}

</p>


</div>







</div>





</div>



))

}



</div>







</div>





</div>

);


}
