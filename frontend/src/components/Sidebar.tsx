"use client";


import Link from "next/link";

import {
useState
} from "react";


import {
Menu,
X,
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


const [open,setOpen] = useState(false);





const menu = [

{
name:"Dashboard",
url:"/dashboard",
icon:Home
},

{
name:"Tournaments",
url:"/tournaments",
icon:Trophy
},

{
name:"My Tournaments",
url:"/my-tournaments",
icon:Gamepad2
},

{
name:"Deposit",
url:"/deposit",
icon:Wallet
},

{
name:"Withdraw",
url:"/withdraw",
icon:ArrowDownToLine
},

{
name:"Matches",
url:"/matches",
icon:Swords
},

{
name:"Leaderboard",
url:"/leaderboard",
icon:BarChart3
},

{
name:"Profile",
url:"/profile",
icon:User
},

{
name:"Settings",
url:"/settings",
icon:Settings
}

];







return (

<>


{/* MOBILE BUTTON */}

<button

onClick={()=>setOpen(true)}

className="
md:hidden
fixed
top-4
left-4
z-50
bg-zinc-900
p-3
rounded-xl
border
border-zinc-700
"

>

<Menu />

</button>








{/* OVERLAY */}

{

open &&

<div

onClick={()=>setOpen(false)}

className="
fixed
inset-0
bg-black/60
z-40
md:hidden
"

/>

}








{/* SIDEBAR */}

<aside

className={`

fixed
z-50
top-0
left-0
h-screen
w-64
bg-zinc-950
border-r
border-zinc-800
p-5
text-white
transform
transition-transform
duration-300

md:translate-x-0

${

open

?

"translate-x-0"

:

"-translate-x-full md:translate-x-0"

}

`}

>







<div className="
flex
justify-between
items-center
mb-10
">





<h1 className="
text-2xl
font-black
text-green-400
">

TOURNAMENT HUB

</h1>







<button

onClick={()=>setOpen(false)}

className="
md:hidden
"

>

<X />

</button>







</div>








<nav className="
space-y-2
">





{

menu.map((item)=>(



<Link

key={item.name}

href={item.url}

onClick={()=>setOpen(false)}

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


<item.icon size={20}/>


{item.name}


</Link>



))

}



</nav>








<button

className="
absolute
bottom-6
flex
items-center
gap-3
text-red-400
p-3
"

>

<LogOut size={20}/>

Logout

</button>








</aside>





</>

);


}
