"use client";

import {
  useEffect,
  useState
} from "react";


import api from "@/lib/api";


import {
  Trophy,
  Plus,
  XCircle
} from "lucide-react";





export default function AdminTournamentsPage(){



const [tournaments,setTournaments] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);



const [showForm,setShowForm] =
useState(false);



const [form,setForm] =
useState<any>({

name:"",

entry_fee:"",

currency:"USDT",

reward:"",

start_date:"",

start_time:""


});







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



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}







function change(
field:string,
value:string
){


setForm({

...form,

[field]:value

});


}








async function createTournament(){


try{


await api.post(

"/admin/tournaments",

form

);



setShowForm(false);


setForm({

name:"",

entry_fee:"",

currency:"USDT",

reward:"",

start_date:"",

start_time:""


});



loadTournaments();



}catch(error){


console.log(error);


}



}
  async function closeTournament(id:string){


try{


await api.post(

`/admin/tournaments/${id}/close`

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





<div className="
flex
justify-between
items-center
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

Tournaments

</h1>


<p className="
text-zinc-400
mt-2
">

Create and manage tournaments

</p>


</div>





<button

onClick={()=>
setShowForm(true)
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

<Plus/>

Create

</button>



</div>








{

showForm &&

<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
space-y-4
">


<h2 className="
text-2xl
font-black
">

Create Tournament

</h2>






<input

placeholder="Tournament Name"

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

value={form.name}

onChange={(e)=>
change(
"name",
e.target.value
)
}

/>






<input

placeholder="Entry Fee"

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

value={form.entry_fee}

onChange={(e)=>
change(
"entry_fee",
e.target.value
)
}

/>







<input

placeholder="Reward"

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

value={form.reward}

onChange={(e)=>
change(
"reward",
e.target.value
)
}

/>







<input

type="date"

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

value={form.start_date}

onChange={(e)=>
change(
"start_date",
e.target.value
)
}

/>







<input

type="time"

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

value={form.start_time}

onChange={(e)=>
change(
"start_time",
e.target.value
)
}

/>







<div className="
flex
gap-3
">


<button

onClick={createTournament}

className="
bg-green-600
px-6
py-3
rounded-xl
font-bold
"

>

Save

</button>




<button

onClick={()=>
setShowForm(false)
}

className="
bg-red-600
px-6
py-3
rounded-xl
font-bold
flex
gap-2
"

>

<XCircle/>

Cancel

</button>


</div>




</div>


}








<div className="
grid
gap-5
">


{

loading

?

<p className="text-zinc-400">

Loading...

</p>


:


tournaments.map((item:any)=>(


<div

key={item.id}

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

{item.name}

</h2>


<p className="
text-zinc-400
mt-2
">

Status:
{" "}
{item.status}

</p>





<button

onClick={()=>
closeTournament(item.id)
}

className="
mt-5
bg-red-600
px-5
py-3
rounded-xl
font-bold
"

>

Close Entries

</button>



</div>


))


}



</div>





</div>


);


}
