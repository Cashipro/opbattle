"use client";

import {
  useEffect,
  useState
} from "react";

import api from "@/lib/api";

import {
  Medal,
  Trophy,
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
"/admin/results"
);



setMatches(
res.data || []
);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}








function updateResult(
matchId:string,
field:string,
value:string
){


setResults({

...results,

[matchId]:{

...results[matchId],

[field]:value

}

});


}








async function saveResult(
matchId:string
){


try{


await api.post(

`/admin/results/${matchId}`,

results[matchId]

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


<Trophy className="text-yellow-400"/>

Results

</h1>



<p className="
text-zinc-400
mt-2
">

Update match rankings and points

</p>



</div>





<div className="
space-y-5
">


{

loading

?

<p className="text-zinc-400">
Loading results...
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


<h2 className="
text-2xl
font-black
mb-5
">

{match.tournament?.name}

</h2>
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

        onClick={()=>
          saveResult(match.id)
        }

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

        <Save className="w-5 h-5"/>

        Save Result

        </button>





      </div>


    ))


    }



    </div>


  </div>

);

}
