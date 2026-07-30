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


const [creating,setCreating] =
useState(false);



const [form,setForm] =
useState({

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


console.log(
"TOURNAMENT LIST:",
res.data
);


setTournaments(
Array.isArray(res.data)
?
res.data
:
res.data?.tournaments || []
);



}catch(error:any){


console.log(
"LOAD ERROR:",
error.response?.data || error
);


alert(
"Cannot load tournaments"
);


}finally{


setLoading(false);


}


}









function change(
field:keyof typeof form,
value:string
){


setForm({

...form,

[field]:value

});


}









async function createTournament(){


try{


setCreating(true);



const payload = {


name:form.name,


entry_fee:Number(form.entry_fee),


currency:form.currency,


reward:Number(form.reward || 0),


start_date:
`${form.start_date}T00:00:00`,


start_time:form.start_time


};



console.log(
"SENDING:",
payload
);



const res =
await api.post(

"/admin/tournaments",

payload

);



console.log(
"CREATE RESPONSE:",
res.data
);



alert(
"Tournament created successfully"
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



}catch(error:any){


console.log(
"CREATE ERROR:",
error.response?.data || error
);



alert(

error.response?.data?.message ||

"Tournament creation failed"

);



}finally{


setCreating(false);


}


}









async function closeTournament(
id:string
){


try{


await api.post(

`/admin/tournaments/${id}/close`

);


alert(
"Tournament closed"
);


loadTournaments();



}catch(error:any){


console.log(
"CLOSE ERROR:",
error.response?.data || error
);


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

type="button"

onClick={()=>setShowForm(true)}

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









{showForm && (

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

value={form.name}

onChange={(e)=>
change(
"name",
e.target.value
)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

/>






<input

placeholder="Entry Fee"

type="number"

value={form.entry_fee}

onChange={(e)=>
change(
"entry_fee",
e.target.value
)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

/>






<input

placeholder="Reward"

type="number"

value={form.reward}

onChange={(e)=>
change(
"reward",
e.target.value
)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

/>






<input

type="date"

value={form.start_date}

onChange={(e)=>
change(
"start_date",
e.target.value
)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

/>






<input

type="time"

value={form.start_time}

onChange={(e)=>
change(
"start_time",
e.target.value
)
}

className="
w-full
bg-zinc-800
rounded-xl
p-4
"

/>






<div className="
flex
gap-3
">


<button

type="button"

disabled={creating}

onClick={createTournament}

className="
bg-green-600
px-6
py-3
rounded-xl
font-bold
"

>

{

creating
?
"Creating..."
:
"Save"

}

</button>






<button

type="button"

onClick={()=>setShowForm(false)}

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

)}









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

Status: {item.status}

</p>




<button

type="button"

onClick={()=>closeTournament(item.id)}

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
