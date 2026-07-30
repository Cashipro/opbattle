"use client";

import {
  useEffect,
  useState
} from "react";

import api from "@/lib/api";

import {
  Swords,
  Save,
  CheckCircle
} from "lucide-react";


export default function AdminMatchesPage(){


const [matches,setMatches] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);



const [rooms,setRooms] =
useState<any>({});






useEffect(()=>{

loadMatches();

},[]);







async function loadMatches(){


try{


const res =
await api.get(
"/admin/tournaments"
);



let allMatches:any[] = [];



for(const tournament of res.data || []){


if(tournament.matches){


allMatches.push(
...tournament.matches
);


}


}



setMatches(allMatches);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}








function updateRoom(
id:string,
field:string,
value:string
){


setRooms({

...rooms,

[id]:{

...rooms[id],

[field]:value

}

});


}








async function addRoom(
id:string
){


try{


await api.post(

`/admin/tournaments/match/${id}/room`,

{

room_id:
rooms[id]?.room_id,


room_password:
rooms[id]?.room_password


}

);



loadMatches();



}catch(error){


console.log(error);


}


}








async function finishMatch(
id:string
){


try{


await api.post(

`/admin/tournaments/match/${id}/finish`

);



loadMatches();



}catch(error){


console.log(error);


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

<Swords className="text-green-500"/>

Matches

</h1>


<p className="
text-zinc-400
mt-2
">

Manage rooms and match status

</p>


</div>





<div className="space-y-5">


{

loading

?

<p className="text-zinc-400">
Loading matches...
</p>


:


matches.length === 0

?

<p className="text-zinc-400">
No matches found
</p>


:


matches.map((match:any)=>(


<div

key={match.id}

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
mb-6
">


<div>


<h2 className="
text-2xl
font-black
">

{match.tournament?.name || "Tournament Match"}

</h2>



<p className="
text-zinc-400
mt-1
">

Status:
{" "}
{match.status}

</p>


</div>




<div className="
bg-zinc-800
px-4
py-2
rounded-xl
">

ID:
{" "}
{match.id.slice(0,8)}

</div>



</div>







<div className="
grid
md:grid-cols-2
gap-4
">



<input

placeholder="Room ID"

className="
bg-zinc-800
rounded-xl
p-4
outline-none
"

value={
rooms[match.id]?.room_id || ""
}

onChange={(e)=>

updateRoom(
match.id,
"room_id",
e.target.value
)

}

/>






<input

placeholder="Room Password"

className="
bg-zinc-800
rounded-xl
p-4
outline-none
"

value={
rooms[match.id]?.room_password || ""
}

onChange={(e)=>

updateRoom(
match.id,
"room_password",
e.target.value
)

}

/>



</div>







<div className="
flex
gap-3
mt-5
flex-wrap
">



<button

onClick={()=>
addRoom(match.id)
}

className="
bg-green-600
px-5
py-3
rounded-xl
font-bold
flex
items-center
gap-2
"

>

<Save className="w-5 h-5"/>

Save Room

</button>






<button

onClick={()=>
finishMatch(match.id)
}

className="
bg-blue-600
px-5
py-3
rounded-xl
font-bold
flex
items-center
gap-2
"

>

<CheckCircle className="w-5 h-5"/>

Finish

</button>



</div>





</div>



))


}



</div>


</div>

);


}
