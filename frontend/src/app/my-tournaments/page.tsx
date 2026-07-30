"use client";


import {
useEffect,
useState
} from "react";


import {
useRouter
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import {
getMyTournaments
} from "@/services/tournament";







export default function MyTournaments(){



const router = useRouter();


const [tournaments,setTournaments] = useState<any[]>([]);


const [loading,setLoading] = useState(true);









useEffect(()=>{


load();


},[]);









async function load(){


try{


const data = await getMyTournaments();


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
md:text-5xl
font-black
mb-8
">

🏆 My Tournaments

</h1>









{

loading

?

<div className="
text-gray-400
">

Loading tournaments...

</div>



:

tournaments.length === 0

?

<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
text-center
">

No joined tournaments

</div>



:


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
"

>








<h2 className="
text-2xl
font-black
mb-5
">

{

item.tournament?.name ||

item.name

}

</h2>









<div className="
space-y-3
bg-zinc-800
rounded-xl
p-4
">






<p>

Entry Fee:

<span className="
text-green-400
font-bold
ml-2
">

{

item.tournament?.entry_fee ||

item.entry_fee

}

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

{

item.tournament?.status ||

item.status

}

</span>

</p>







</div>









<button

onClick={()=>{


router.push(

`/team-room/${
item.tournament_id || item.tournament?.id
}`

);


}}


className="
w-full
mt-6
bg-green-600
hover:bg-green-700
py-4
rounded-xl
font-black
"

>

🎮 Open Team Room

</button>








</div>



))


}







</div>



}





</div>






</main>






</div>

);


}
