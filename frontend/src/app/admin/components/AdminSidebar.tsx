"use client";


import Link from "next/link";


import {
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  Medal,
  LogOut
} from "lucide-react";


import {
  useRouter
} from "next/navigation";







export default function AdminSidebar(){


const router = useRouter();






function logout(){


localStorage.removeItem("token");

localStorage.removeItem("user");


document.cookie =
"token=; path=/; max-age=0";


router.push("/login");


}








return (

<aside className="
fixed
left-0
top-0
h-screen
w-72
bg-zinc-950
border-r
border-zinc-800
p-6
z-50
">





<h1 className="
text-3xl
font-black
text-green-400
mb-10
">

OPBATTLE

</h1>







<nav className="
space-y-3
">





<Link

href="/admin"

className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
font-bold
"

>

<LayoutDashboard/>

Dashboard

</Link>







<Link

href="/admin/tournaments"

className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
font-bold
"

>

<Trophy/>

Tournaments

</Link>







<Link

href="/admin/matches"

className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
font-bold
"

>

<Swords/>

Matches

</Link>







<Link

href="/admin/teams"

className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
font-bold
"

>

<Users/>

Teams

</Link>







<Link

href="/admin/results"

className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
font-bold
"

>

<Medal/>

Results

</Link>






</nav>








<button

onClick={logout}

className="
mt-10
w-full
bg-red-600
hover:bg-red-700
rounded-xl
p-4
font-black
flex
items-center
justify-center
gap-2
"

>

<LogOut/>

Logout

</button>







</aside>


);


}
