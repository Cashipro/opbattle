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


const [tournaments,setTournaments] =
useState<any[]>([]);


const [matches,setMatches] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);


const [rooms,setRooms] =
useState<any>({});






useEffect(()=>{

loadTournaments();

},[]);







async function loadTournaments(){


try{


const res =
await api.get(
"/admin/tournaments"
);



setTournaments(
res.data || []
);



let temp:any[]=[];



(res.data || []).forEach((tournament:any)=>{


if(tournament.matches){


temp.push(
...tournament.matches.map((m:any)=>({

...m,

tournamentName:
tournament.name

}))

);


}



});



setMatches(temp);



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








async function addRoom(id:string){


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



loadTournaments();



}catch(error){


console.log(error);


}



}








async function finishMatch(id:string){


try{


await api.post(

`/admin/tournaments/match/${id}/finish`

);



loadTournaments();



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

Manage tournament matches

</p>


</div>







{

loading

?

<p className="text-zinc-400">

Loading matches...

</p>



:


matches.length===0


?

<p className="
text-zinc-400
">

No matches available

</p>



:



<div className="space-y-5">


{

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


<h2 className="
text-2xl
font-black
mb-2
">

{match.tournamentName}

</h2>


<p className="
text-zinc-400
mb-5
">

Status:
{" "}
{match.status}

</p>





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
gap-2
items-center
"

>

<Save/>

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
gap-2
items-center
"

>

<CheckCircle/>

Finish

</button>





</div>






</div>


))


}


</div>


}



</div>

);


}
