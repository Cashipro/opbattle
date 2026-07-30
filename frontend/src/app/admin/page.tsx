"use client";


import {
useEffect,
useState
} from "react";


import api from "@/lib/api";


import {
Trophy,
Swords,
Users,
Activity,
Wallet,
Clock
} from "lucide-react";







export default function AdminDashboard(){



const [stats,setStats] = useState({

users:0,

tournaments:0,

teams:0,

matches:0,

pendingDeposits:0,

approvedDeposits:0

});



const [loading,setLoading] = useState(true);









useEffect(()=>{

loadStats();

},[]);









async function loadStats(){


try{


const res = await api.get(
"/admin/stats"
);



setStats(res.data);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}



}









const cards = [


{

title:"Users",

value:stats.users,

icon:<Users className="text-blue-400 w-8 h-8"/>


},



{

title:"Tournaments",

value:stats.tournaments,

icon:<Trophy className="text-yellow-400 w-8 h-8"/>


},



{

title:"Teams",

value:stats.teams,

icon:<Users className="text-purple-400 w-8 h-8"/>


},



{

title:"Matches",

value:stats.matches,

icon:<Swords className="text-green-400 w-8 h-8"/>


},



{

title:"Pending Deposits",

value:stats.pendingDeposits,

icon:<Clock className="text-orange-400 w-8 h-8"/>


},



{

title:"Approved Deposits",

value:stats.approvedDeposits,

icon:<Wallet className="text-green-400 w-8 h-8"/>


}



];









return (

<div className="
space-y-10
">





<div>

<h1 className="
text-4xl
font-black
">

Admin Dashboard

</h1>


<p className="
text-zinc-400
mt-2
">

Manage OPBATTLE platform

</p>


</div>









<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">



{

cards.map((card)=>(


<div

key={card.title}

className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
"

>


<div className="
mb-4
">

{card.icon}

</div>



<p className="
text-zinc-400
">

{card.title}

</p>



<h2 className="
text-4xl
font-black
mt-2
">


{

loading

?

"..."

:

card.value

}


</h2>



</div>


))


}



</div>









<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
flex
items-center
gap-4
">


<Activity className="text-green-400"/>


<div>

<p className="
text-zinc-400
">

System Status

</p>


<h2 className="
font-black
text-green-400
">

ONLINE

</h2>


</div>


</div>






</div>

);


}
