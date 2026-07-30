"use client";


import {
useEffect,
useState
} from "react";


import Sidebar from "@/components/Sidebar";


import api from "@/lib/api";


import {
Wallet,
Trophy,
Activity
} from "lucide-react";







export default function Dashboard(){



const [user,setUser] = useState<any>({});


const [joined,setJoined] = useState(0);


const [loading,setLoading] = useState(true);









useEffect(()=>{


loadUser();

loadTournaments();


},[]);









async function loadUser(){


try{


const res = await api.get(
"/auth/me"
);


setUser(res.data);





}catch(error){


console.log(error);


}



}









async function loadTournaments(){


try{


const res = await api.get(

"/tournaments/user/my-tournaments"

);


setJoined(
res.data.length
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
mb-2
">

Welcome,

{" "}

{user.name || "Player"}

</h1>







<p className="
text-gray-400
mb-8
">

PUBG Tournament Dashboard

</p>









<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-5
">







<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Wallet className="
text-green-400
mb-4
w-8
h-8
"/>


<p className="
text-gray-400
">

Balance

</p>


<h2 className="
text-3xl
font-black
text-green-400
mt-3
">

{user.balance || 0}

</h2>


</div>









<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Trophy className="
text-blue-400
mb-4
w-8
h-8
"/>


<p className="
text-gray-400
">

Joined Tournaments

</p>


<h2 className="
text-3xl
font-black
text-blue-400
mt-3
">


{

loading

?

"..."

:

joined

}


</h2>


</div>









<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
">


<Activity className="
text-yellow-400
mb-4
w-8
h-8
"/>


<p className="
text-gray-400
">

Player Status

</p>


<h2 className="
text-2xl
font-black
text-yellow-400
mt-3
">

ACTIVE

</h2>


</div>








</div>









<h2 className="
text-2xl
font-bold
mt-10
mb-5
">

Quick Actions

</h2>









<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-5
">






<a
href="/tournaments"
className="
bg-blue-600
rounded-2xl
p-6
font-bold
text-center
hover:scale-105
transition
"
>

🏆 Browse Tournaments

</a>








<a
href="/deposit"
className="
bg-green-600
rounded-2xl
p-6
font-bold
text-center
hover:scale-105
transition
"
>

💰 Deposit

</a>








<a
href="/withdraw"
className="
bg-red-600
rounded-2xl
p-6
font-bold
text-center
hover:scale-105
transition
"
>

💸 Withdraw

</a>






</div>








</div>






</main>






</div>

);


}
