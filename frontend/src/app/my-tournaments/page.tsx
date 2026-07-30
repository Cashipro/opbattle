"use client";


import {
useEffect,
useState
} from "react";


import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";


import {
getMyTournaments
} from "@/services/tournament";



import Link from "next/link";







export default function MyTournaments(){



const [data,setData] = useState<any[]>([]);

const [loading,setLoading] = useState(true);








useEffect(()=>{


load();


},[]);









async function load(){


try{


const res = await getMyTournaments();


setData(res);



}catch(error){


console.log(error);



}finally{


setLoading(false);


}



}









return(

<>


<Navbar />



<main className="
min-h-screen
bg-black
text-white
p-6
">





<h1 className="
text-4xl
font-black
mb-8
">

My Tournaments

</h1>







{

loading ?

(

<div className="text-center">

Loading...

</div>

)


:

data.length === 0

?

(

<div className="
bg-zinc-900
rounded-2xl
p-8
text-center
">

No tournaments joined yet

</div>

)


:

(

<div className="
grid
md:grid-cols-2
gap-6
">





{

data.map((item:any)=>(



<div

key={item.id}

className="
game-card
p-6
bg-zinc-900
rounded-3xl
border
border-zinc-700
"

>



<h2 className="
text-2xl
font-bold
mb-4
">

{
item.tournament?.name
}

</h2>







<p>

Entry Fee:

<span className="
text-green-400
ml-2
">

{
item.tournament?.entry_fee
}

{" "}

{
item.tournament?.currency
}

</span>

</p>







<p>

Status:

<span className="
text-yellow-400
ml-2
uppercase
">

{
item.tournament?.status
}

</span>

</p>









<div className="
mt-6
flex
gap-3
flex-wrap
">



<Link

href={`/team-room/${item.tournament_id}`}

className="
bg-blue-600
px-5
py-3
rounded-xl
font-bold
"

>

Team Room

</Link>







<Link

href={`/tournaments/${item.tournament_id}`}

className="
bg-zinc-700
px-5
py-3
rounded-xl
font-bold
"

>

Details

</Link>






</div>







</div>



))

}



</div>

)

}




</main>



<Footer />


</>

);


}
