"use client";


import {
useEffect,
useState
} from "react";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";








export default function Matches(){



const [matches,setMatches] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);








async function load(){


try{


const res = await api.get(

"/matches/my"

);



setMatches(res.data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}








return (

<div
className="
flex
min-h-screen
bg-black
text-white
"
>







<Sidebar />








<main
className="
flex-1
p-4
pt-20
md:ml-64
md:p-10
md:pt-10
"
>







<div
className="
max-w-7xl
mx-auto
"
>







<h1
className="
text-3xl
md:text-4xl
font-black
mb-8
"
>

⚔ Matches

</h1>








{

loading

?

(

<div
className="
text-gray-400
"
>

Loading matches...

</div>

)


:

matches.length===0

?

(

<div
className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
text-center
"
>

No matches available

</div>

)


:

(

<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
"
>








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








<h2
className="
text-2xl
font-bold
mb-5
"
>

Match #{match.match_number}

</h2>








<p
className="
text-gray-400
"
>

Status

</p>



<p
className="
text-green-400
font-bold
uppercase
mb-4
"
>

{match.status}

</p>









<div
className="
bg-zinc-800
rounded-xl
p-4
space-y-3
"
>








<p>

Room ID:

<span
className="
text-green-400
ml-2
font-bold
"
>

{match.room_id || "Not Added"}

</span>

</p>








<p>

Password:

<span
className="
text-green-400
ml-2
font-bold
"
>

{match.room_password || "Not Added"}

</span>

</p>








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
