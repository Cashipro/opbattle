"use client";


import {
useEffect,
useState
} from "react";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";







export default function Leaderboard(){



const [results,setResults] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);








async function load(){


try{


const res =
await api.get(
"/results/board"
);



setResults(
res.data
);



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

📊 Leaderboard

</h1>








<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
overflow-hidden
">






<div className="
overflow-x-auto
">





<table className="
w-full
min-w-[700px]
">






<thead>

<tr className="
border-b
border-zinc-800
text-gray-400
">

<th className="
p-4
text-left
">

Rank

</th>


<th className="
p-4
text-left
">

Team

</th>


<th className="
p-4
text-left
">

Kills

</th>


<th className="
p-4
text-left
">

Position

</th>


<th className="
p-4
text-left
">

Points

</th>


</tr>

</thead>








<tbody>

{

loading

?

<tr>

<td

colSpan={5}

className="
p-6
text-center
"

>

Loading...

</td>

</tr>



:


results.length === 0

?

<tr>

<td

colSpan={5}

className="
p-6
text-center
text-gray-400
"

>

No Results

</td>

</tr>



:


results.map(
(item:any,index:number)=>(



<tr

key={item.id}

className="
border-b
border-zinc-800
"

>



<td className="
p-4
font-bold
text-yellow-400
">

#{index+1}

</td>





<td className="
p-4
font-bold
">

{

item.team?.name ||

"Team"

}

</td>





<td className="
p-4
">

{item.kills}

</td>





<td className="
p-4
">

{item.position}

</td>





<td className="
p-4
font-bold
text-green-400
">

{item.points}

</td>





</tr>



)

)

}





</tbody>







</table>






</div>








</div>








</div>





</main>






</div>

);


}
