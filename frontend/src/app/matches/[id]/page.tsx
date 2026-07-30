"use client";

import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import api from "@/lib/api";







export default function MatchRoomPage(){


const params = useParams();

const id = params.id as string;


const [match,setMatch] = useState<any>(null);

const [loading,setLoading] = useState(true);







useEffect(()=>{


if(id){

loadMatch();

}


},[id]);








async function loadMatch(){


try{


const res = await api.get(

`/tournaments/match/${id}`

);


setMatch(res.data);



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

Loading Match...

</div>

);


}







if(!match){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
">

Match not found

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

MATCH ROOM

</h1>








<div className="
bg-zinc-900
border
border-zinc-700
rounded-3xl
p-6
mb-6
">





<div className="
grid
md:grid-cols-3
gap-4
">





<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="text-gray-400">

Room ID

</p>


<p className="font-bold text-blue-400">

{match.room_id || "Not Added"}

</p>


</div>







<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="text-gray-400">

Password

</p>


<p className="font-bold text-yellow-400">

{match.room_password || "Not Added"}

</p>


</div>







<div className="
bg-zinc-800
rounded-xl
p-4
">

<p className="text-gray-400">

Status

</p>


<p className="
font-bold
uppercase
text-green-400
">

{match.status}

</p>


</div>





</div>





</div>









<h2 className="
text-2xl
font-bold
mb-4
">

Teams

</h2>








<div className="
grid
md:grid-cols-2
gap-5
">





{

match.teams?.map((item:any)=>(



<div

key={item.id}

className="
bg-zinc-900
border
border-zinc-700
rounded-2xl
p-5
"

>



<h3 className="
text-xl
font-bold
text-blue-400
mb-3
">

#{item.team.team_number}

{" "}

{item.team.name}

</h3>







<div className="space-y-2">


{

item.team.slots?.map((slot:any)=>(



<div

key={slot.id}

className="
bg-zinc-800
rounded-xl
p-3
"

>


<p>

Slot {slot.slot_number}

</p>




{

slot.user

?

<p className="text-gray-300">

{slot.user.name}

<br/>

PUBG ID:
{slot.user.pubg_uid}

</p>


:

<p className="text-gray-500">

Empty

</p>


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





</div>

);


}
