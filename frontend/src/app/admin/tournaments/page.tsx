"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import api from "@/lib/api";

import {
  Plus,
  Trophy,
  Eye,
  XCircle
} from "lucide-react";


export default function AdminTournamentsPage(){


const [tournaments,setTournaments] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);


const [showCreate,setShowCreate] =
useState(false);



const [form,setForm] =
useState({

name:"",
entry_fee:"",
currency:"UC",
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
await api.get("/tournaments");


setTournaments(
res.data || []
);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}






async function createTournament(){


try{


await api.post(
"/admin/tournaments",
{

name:form.name,

entry_fee:Number(form.entry_fee),

currency:form.currency,

reward:Number(form.reward),

start_date:form.start_date,

start_time:form.start_time


}
);



setShowCreate(false);


setForm({

name:"",
entry_fee:"",
currency:"UC",
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


await api.patch(

`/admin/tournaments/${id}/close`

);


loadTournaments();



}catch(error){


console.log(error);


}


}






return (

<div className="space-y-8">


<div className="
flex
justify-between
items-center
">


<div>

<h1 className="
text-4xl
font-black
">

Tournaments

</h1>


<p className="
text-zinc-400
mt-2
">

Manage all tournaments

</p>


</div>





<button

onClick={()=>setShowCreate(true)}

className="
bg-green-600
px-5
py-3
rounded-2xl
font-bold
flex
items-center
gap-2
"

>


<Plus className="w-5 h-5"/>

Create


</button>


</div>
        {showCreate && (

        <div className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-6
        space-y-4
        ">

          <h2 className="text-2xl font-black">
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
            onChange={(e)=>setForm({
              ...form,
              name:e.target.value
            })}
          />


          <input
            placeholder="Entry Fee"
            type="number"
            className="
            w-full
            bg-zinc-800
            rounded-xl
            p-4
            "
            value={form.entry_fee}
            onChange={(e)=>setForm({
              ...form,
              entry_fee:e.target.value
            })}
          />


          <input
            placeholder="Currency"
            className="
            w-full
            bg-zinc-800
            rounded-xl
            p-4
            "
            value={form.currency}
            onChange={(e)=>setForm({
              ...form,
              currency:e.target.value
            })}
          />


          <input
            placeholder="Reward"
            type="number"
            className="
            w-full
            bg-zinc-800
            rounded-xl
            p-4
            "
            value={form.reward}
            onChange={(e)=>setForm({
              ...form,
              reward:e.target.value
            })}
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
            onChange={(e)=>setForm({
              ...form,
              start_date:e.target.value
            })}
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
            onChange={(e)=>setForm({
              ...form,
              start_time:e.target.value
            })}
          />



          <button

          onClick={createTournament}

          className="
          w-full
          bg-green-600
          rounded-xl
          py-4
          font-black
          "
          >

          Save Tournament

          </button>


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
          Loading tournaments...
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
          flex
          justify-between
          items-center
          "

          >


            <div>


              <h2 className="
              text-2xl
              font-black
              flex
              items-center
              gap-2
              ">

              <Trophy className="text-yellow-400"/>

              {item.name}

              </h2>



              <p className="text-zinc-400 mt-2">

              Entry:
              {" "}
              {item.entry_fee}
              {" "}
              {item.currency}

              </p>



              <p className="text-zinc-400">

              Status:
              {" "}
              {item.status}

              </p>


            </div>





            <div className="
            flex
            gap-3
            ">


              <Link

              href={`/admin/tournaments/${item.id}`}

              className="
              bg-blue-600
              p-3
              rounded-xl
              "
              >

              <Eye/>

              </Link>





              <button

              onClick={()=>closeTournament(item.id)}

              className="
              bg-red-600
              p-3
              rounded-xl
              "
              >

              <XCircle/>

              </button>



            </div>



          </div>


        ))


      }


      </div>



    </div>

);

}
