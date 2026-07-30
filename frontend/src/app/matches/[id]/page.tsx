"use client";


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";







export default function MatchPage(){



const params = useParams<{id:string}>();

const id = params?.id;





const [match,setMatch] = useState<any>(null);

const [loading,setLoading] = useState(true);









useEffect(()=>{


if(id){

loadMatch();

}


},[id]);









async function loadMatch(){


try{


const res = await api.get(

`/matches/${id}`

);



setMatch(res.data);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}









if(!id || loading){


return (

<div
className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
"
>

Loading Match...

</div>

);


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
max-w-5xl
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

🎮 Match Details

</h1>








{

match

?

(

<div
className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
md:p-8
space-y-5
"
>







<div
className="
bg-zinc-800
rounded-xl
p-4
"
>

<p
className="
text-gray-400
"
>

Match ID

</p>


<p
className="
font-bold
break-all
"
>

{match.id}

</p>


</div>








<div
className="
bg-zinc-800
rounded-xl
p-4
"
>

<p
className="
text-gray-400
"
>

Status

</p>


<p
className="
font-bold
text-blue-400
uppercase
"
>

{match.status}

</p>


</div>








<div
className="
bg-zinc-800
rounded-xl
p-4
"
>

<p
className="
text-gray-400
"
>

Room ID

</p>


<p
className="
font-bold
text-green-400
"
>

{match.room_id || "Not Added"}

</p>


</div>








<div
className="
bg-zinc-800
rounded-xl
p-4
"
>

<p
className="
text-gray-400
"
>

Room Password

</p>


<p
className="
font-bold
text-yellow-400
"
>

{match.room_password || "Not Added"}

</p>


</div>








</div>

)

:

(

<div
className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
text-center
text-gray-400
"
>

Match not found

</div>

)

}







</div>






</main>







</div>

);


}
