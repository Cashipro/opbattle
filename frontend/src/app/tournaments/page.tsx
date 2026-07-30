"use client";


import {
useEffect,
useState
} from "react";


import Link from "next/link";


import Sidebar from "@/components/Sidebar";


import {
getTournaments
} from "@/services/tournament";








export default function TournamentsPage(){



const [tournaments,setTournaments] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);








async function load(){


try{


const data =
await getTournaments();


setTournaments(data);



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
md:ml-64
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

🏆 Tournaments

</h1>







{

loading

?

(

<div className="
text-center
text-gray-400
">

Loading tournaments...

</div>

)


:

tournaments.length === 0

?

(

<div className="
bg-zinc-900
rounded-3xl
p-8
text-center
border
border-zinc-800
">

No tournaments available

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

tournaments.map((item:any)=>(



<div

key={item.id}

className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
hover:border-green-500
transition
"

>



<h2 className="
text-2xl
font-bold
mb-5
">

{item.name}

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

{item.entry_fee}

{" "}

{item.currency || ""}

</span>

</p>







<p>

Reward:

<span className="
text-yellow-400
font-bold
ml-2
">

{item.reward}

</span>

</p>







<p>

Status:

<span className="
text-blue-400
font-bold
ml-2
uppercase
">

{item.status}

</span>

</p>







<p>

Start:

<span className="
ml-2
">

{
new Date(
item.start_date
).toLocaleDateString()
}

</span>

</p>








</div>








<Link

href={`/tournaments/${item.id}`}

className="
block
mt-6
bg-green-600
text-center
rounded-xl
py-3
font-bold
hover:bg-green-700
transition
"

>

View Tournament

</Link>







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
