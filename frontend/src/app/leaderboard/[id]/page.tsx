"use client";


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";







export default function LeaderboardPage(){



const params = useParams<{id:string}>();

const id = params?.id;





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









if(!id){


return (

<div
className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
"
>

Loading...

</div>

);


}









if(loading){


return (

<div
className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
"
>

Loading Leaderboard...

</div>

);


}









return (

<div
className="
flex
min-h-screen
bg-black
text-white
"
>







<Sidebar />








<main
className="
flex-1
p-4
pt-20
md:ml-64
md:p-10
md:pt-10
"
>







<div
className="
max-w-5xl
mx-auto
"
>







<h1
className="
text-3xl
md:text-4xl
font-black
text-center
mb-8
"
>

🏆 RESULT BOARD

</h1>









<div
className="
space-y-4
"
>





{

ranking.length===0

?

<div
className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
text-center
text-gray-400
"
>

No Results Found

</div>


:


ranking.map((team:any,index:number)=>(



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

gap-5

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


<h2
className="
text-xl
font-bold
"
>

#{team.team_number} {team.team_name}

</h2>


<p
className="
text-gray-400
mt-2
"
>

Rank: {team.rank}

</p>


</div>








<div
className="
grid
grid-cols-2
gap-6
text-center
"
>







<div>


<p
className="
text-gray-400
text-sm
"
>

Kills

</p>


<p
className="
text-green-400
font-bold
text-xl
"
>

{team.kills}

</p>


</div>








<div>


<p
className="
text-gray-400
text-sm
"
>

Points

</p>


<p
className="
text-blue-400
font-bold
text-xl
"
>

{team.points}

</p>


</div>








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
