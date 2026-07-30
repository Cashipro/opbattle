"use client";

import {
  useEffect,
  useState
} from "react";


import api from "@/lib/api";


import {
  Users,
  Shield,
  Crown
} from "lucide-react";







export default function AdminTeamsPage(){



const [tournaments,setTournaments] =
useState<any[]>([]);



const [teams,setTeams] =
useState<any[]>([]);



const [loading,setLoading] =
useState(true);






useEffect(()=>{

loadTeams();

},[]);








async function loadTeams(){


try{


const res =
await api.get(
"/admin/tournaments"
);



setTournaments(
res.data || []
);



let allTeams:any[] = [];




for(const tournament of res.data || []){


try{


const teamRes =
await api.get(

`/admin/tournaments/${tournament.id}/teams`

);



allTeams.push(
...teamRes.data.map((team:any)=>({

...team,

tournamentName:
tournament.name

}))

);



}catch(error){


console.log(error);


}



}



setTeams(allTeams);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}
  return (

<div className="
space-y-8
">





<div>


<h1 className="
text-4xl
font-black
flex
items-center
gap-3
">

<Users className="
text-blue-500
"/>

Teams

</h1>



<p className="
text-zinc-400
mt-2
">

Manage tournament teams and players

</p>


</div>









{

loading

?


<p className="
text-zinc-400
">

Loading teams...

</p>



:



teams.length===0


?


<p className="
text-zinc-400
">

No teams found

</p>



:


<div className="
grid
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
p-6
"

>



<div className="
flex
justify-between
items-center
mb-5
">



<div>


<h2 className="
text-2xl
font-black
flex
gap-2
items-center
">


<Shield className="
text-green-400
"/>


{team.name}


</h2>



<p className="
text-zinc-400
mt-1
">

Tournament:

{" "}

{team.tournamentName}

</p>


</div>





<div className="
bg-zinc-800
px-4
py-2
rounded-xl
">

Slots:

{" "}

{team.slots?.length || 0}

</div>




</div>








<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-4
">



{

team.slots?.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-2xl
p-4
"

>


<p className="
text-zinc-400
text-sm
">

Slot {slot.slot_number}

</p>





{

slot.user

?

<div className="mt-2">


<p className="
font-bold
text-green-400
">

{slot.user.name}

</p>


<p className="
text-sm
text-zinc-400
">

PUBG:

{" "}

{slot.user.pubg_uid}

</p>


</div>


:


<p className="
text-zinc-500
mt-2
">

Empty

</p>


}



</div>



))


}



</div>








{

team.captain &&

<div className="
mt-5
bg-yellow-500/10
border
border-yellow-500/20
rounded-xl
p-4
flex
gap-2
items-center
">


<Crown className="
text-yellow-400
"/>


Captain:

{" "}

{team.captain.name}



</div>


}




</div>



))


}



</div>


}




</div>


);


}
