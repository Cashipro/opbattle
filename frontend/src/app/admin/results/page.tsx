"use client";

import {
  useEffect,
  useState
} from "react";


import api from "@/lib/api";


import {
  Medal,
  Save
} from "lucide-react";







export default function AdminResultsPage(){



const [matches,setMatches] =
useState<any[]>([]);



const [loading,setLoading] =
useState(true);



const [results,setResults] =
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



let allMatches:any[]=[];



(res.data || []).forEach((t:any)=>{


if(t.matches){


allMatches.push(

...t.matches.map((m:any)=>({

...m,

tournamentName:t.name

}))

);


}



});




setMatches(allMatches);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}








function updateResult(

id:string,

field:string,

value:string

){


setResults({

...results,

[id]:{

...results[id],

[field]:value

}


});


}
  async function saveResult(id:string){


try{


await api.post(

`/admin/results/${id}`,

{

team_id:
results[id]?.team_id,


kills:
Number(results[id]?.kills || 0),


points:
Number(results[id]?.points || 0)


}

);



alert(
"Result saved"
);



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

<Medal className="
text-yellow-400
"/>

Results

</h1>


<p className="
text-zinc-400
mt-2
">

Manage match results and points

</p>


</div>








{

loading

?

<p className="
text-zinc-400
">

Loading matches...

</p>



:



matches.length===0

?

<p className="
text-zinc-400
">

No matches found

</p>



:


<div className="
space-y-5
">


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
">

{match.tournamentName}

</h2>



<p className="
text-zinc-400
mb-5
">

Match:

{" "}

{match.id.slice(0,8)}

</p>







<div className="
grid
md:grid-cols-3
gap-4
">





<input

placeholder="Team ID"

className="
bg-zinc-800
rounded-xl
p-4
"

value={
results[match.id]?.team_id || ""
}

onChange={(e)=>

updateResult(

match.id,

"team_id",

e.target.value

)

}

/>








<input

placeholder="Kills"

type="number"

className="
bg-zinc-800
rounded-xl
p-4
"

value={
results[match.id]?.kills || ""
}

onChange={(e)=>

updateResult(

match.id,

"kills",

e.target.value

)

}

/>








<input

placeholder="Points"

type="number"

className="
bg-zinc-800
rounded-xl
p-4
"

value={
results[match.id]?.points || ""
}

onChange={(e)=>

updateResult(

match.id,

"points",

e.target.value

)

}

/>






</div>








<button

onClick={()=>saveResult(match.id)}

className="
mt-5
bg-green-600
px-6
py-3
rounded-xl
font-black
flex
items-center
gap-2
"

>


<Save className="
w-5
h-5
"/>


Save Result


</button>






</div>


))


}



</div>


}





</div>


);


}
