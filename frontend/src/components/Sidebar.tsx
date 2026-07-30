"use client";


import Link from "next/link";


import {
Home,
Trophy,
Gamepad2,
Wallet,
ArrowDownToLine,
Swords,
BarChart3,
User,
Settings,
LogOut
} from "lucide-react";







export default function Sidebar(){


return (

<aside className="
w-64
min-h-screen
bg-zinc-950
border-r
border-zinc-800
p-5
text-white
hidden
md:flex
flex-col
">






<h1 className="
text-2xl
font-black
mb-10
text-green-400
">

TOURNAMENT HUB

</h1>








<nav className="
space-y-2
flex-1
">





<Link

href="/dashboard"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Home size={20}/>

Dashboard

</Link>








<Link

href="/tournaments"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Trophy size={20}/>

Tournaments

</Link>








<Link

href="/my-tournaments"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Gamepad2 size={20}/>

My Tournaments

</Link>








<Link

href="/deposit"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Wallet size={20}/>

Deposit

</Link>








<Link

href="/withdraw"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<ArrowDownToLine size={20}/>

Withdraw

</Link>








<Link

href="/matches"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Swords size={20}/>

Matches

</Link>








<Link

href="/leaderboard"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<BarChart3 size={20}/>

Leaderboard

</Link>








<Link

href="/profile"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<User size={20}/>

Profile

</Link>








<Link

href="/settings"

className="
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-zinc-800
transition
"

>

<Settings size={20}/>

Settings

</Link>








</nav>








<button

className="
flex
items-center
gap-3
p-3
rounded-xl
text-red-400
hover:bg-zinc-800
transition
"

>

<LogOut size={20}/>

Logout

</button>








</aside>

);


}
