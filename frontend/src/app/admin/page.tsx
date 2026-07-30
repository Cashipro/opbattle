"use client";

import {
  useEffect,
  useState
} from "react";


import Link from "next/link";


import api from "@/lib/api";


import {
  Trophy,
  Swords,
  Users,
  Activity
} from "lucide-react";







export default function AdminDashboard(){



const [stats,setStats] =
useState({

tournaments:0,

matches:0,

teams:0,

users:0

});




const [loading,setLoading] =
useState(true);







useEffect(()=>{

loadStats();

},[]);








async function loadStats(){


try{


const tournamentRes =
await api.get(
"/admin/tournaments"
);



let tournaments =
tournamentRes.data || [];



let matches:number = 0;


let teams:number = 0;




tournaments.forEach((item:any)=>{


if(item.matches){

matches += item.matches.length;

}


if(item.teams){

teams += item.teams.length;

}


});





setStats({

tournaments:tournaments.length,

matches,

teams,

users:0

});




}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}
  return (

<div className="
space-y-10
">





<div>


<h1 className="
text-4xl
font-black
">

Admin Dashboard

</h1>


<p className="
text-zinc-400
mt-2
">

Manage OPBATTLE platform

</p>


</div>









<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
">





<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Trophy className="
text-yellow-400
mb-4
w-8
h-8
"/>



<p className="
text-zinc-400
">

Tournaments

</p>



<h2 className="
text-4xl
font-black
">

{
loading
?
"..."
:
stats.tournaments
}

</h2>


</div>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Swords className="
text-green-400
mb-4
w-8
h-8
"/>



<p className="
text-zinc-400
">

Matches

</p>



<h2 className="
text-4xl
font-black
">

{
loading
?
"..."
:
stats.matches
}

</h2>


</div>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Users className="
text-blue-400
mb-4
w-8
h-8
"/>



<p className="
text-zinc-400
">

Teams

</p>



<h2 className="
text-4xl
font-black
">

{
loading
?
"..."
:
stats.teams
}

</h2>


</div>







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Activity className="
text-red-400
mb-4
w-8
h-8
"/>



<p className="
text-zinc-400
">

Status

</p>



<h2 className="
text-2xl
font-black
text-green-400
">

ONLINE

</h2>


</div>






</div>









<div className="
grid
md:grid-cols-3
gap-5
">





<Link

href="/admin/tournaments"

className="
bg-green-600
rounded-2xl
p-5
font-black
text-center
"

>

Manage Tournaments

</Link>







<Link

href="/admin/matches"

className="
bg-blue-600
rounded-2xl
p-5
font-black
text-center
"

>

Manage Matches

</Link>







<Link

href="/admin/teams"

className="
bg-purple-600
rounded-2xl
p-5
font-black
text-center
"

>

Manage Teams

</Link>





</div>





</div>


);


}
