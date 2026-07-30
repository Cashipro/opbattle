"use client";


import {
useEffect,
useState
} from "react";


import Link from "next/link";


import Sidebar from "@/components/Sidebar";


import {
getMyTournaments
} from "@/services/tournament";







export default function MyTournaments(){



const [data,setData] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);








async function load(){


try{


const res =
await getMyTournaments();


setData(res);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}








return (

<div className="
flex
min-h-screen
bg-black
text-white
">






<Sidebar />








<main className="
flex-1
p-4
pt-20
md:p-10
md:pt-10
">






<div className="
max-w-7xl
mx-auto
">





<h1 className="
text-3xl
md:text-4xl
font-black
mb-8
">

🎮 My Tournaments

</h1>







{

loading

?

(

<div className="
text-center
text-gray-400
">

Loading...

</div>

)


:

data.length === 0

?

(

<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
text-center
">

No tournament joined yet

</div>

)


:

(

<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">





{

data.map((item:any)=>(



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
font-bold
mb-5
">

{item.tournament?.name}

</h2>







<div className="
space-y-3
text-gray-300
">





<p>

Entry Fee:

<span className="
text-green-400
font-bold
ml-2
">

{item.tournament?.entry_fee}

</span>

</p>







<p>

Status:

<span className="
text-blue-400
uppercase
font-bold
ml-2
">

{item.tournament?.status}

</span>

</p>







<p>

Joined:

<span className="ml-2">

{
new Date(
item.joined_at
).toLocaleDateString()
}

</span>

</p>







</div>








<div className="
mt-6
flex
flex-col
gap-3
">





<Link

href={`/team-room/${item.tournament_id}`}

className="
bg-green-600
rounded-xl
py-3
text-center
font-bold
hover:bg-green-700
"

>

👥 Open Team Room

</Link>








<Link

href={`/tournaments/${item.tournament_id}`}

className="
bg-zinc-700
rounded-xl
py-3
text-center
font-bold
"

>

View Details

</Link>







</div>







</div>



))

}



</div>

)

}





</div>





</main>






</div>

);


}
