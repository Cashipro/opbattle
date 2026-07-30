"use client";


import {
  useState
} from "react";


import Link from "next/link";


import {
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  Medal,
  LogOut,
  Menu,
  X
} from "lucide-react";


import {
  useRouter
} from "next/navigation";







export default function AdminSidebar(){


const router = useRouter();


const [open,setOpen] =
useState(false);








function logout(){


localStorage.removeItem("token");

localStorage.removeItem("user");


document.cookie =
"token=; path=/; max-age=0";


router.push("/login");


}








const links = [

{
name:"Dashboard",
url:"/admin",
icon:<LayoutDashboard/>
},

{
name:"Tournaments",
url:"/admin/tournaments",
icon:<Trophy/>
},

{
name:"Matches",
url:"/admin/matches",
icon:<Swords/>
},

{
name:"Teams",
url:"/admin/teams",
icon:<Users/>
},

{
name:"Results",
url:"/admin/results",
icon:<Medal/>
}

];








return (

<>



<button

onClick={()=>
setOpen(true)
}

className="
md:hidden
fixed
top-4
left-4
z-[60]
bg-zinc-900
p-3
rounded-xl
"

>

<Menu/>

</button>







<aside className={`

fixed
top-0
left-0
h-screen
w-72
bg-zinc-950
border-r
border-zinc-800
p-6
z-50
transition-transform
duration-300


${

open

?

"translate-x-0"

:

"-translate-x-full"

}


md:translate-x-0

`}>







<div className="
flex
justify-between
items-center
mb-10
">


<h1 className="
text-3xl
font-black
text-green-400
">

OPBATTLE

</h1>





<button

onClick={()=>
setOpen(false)
}

className="
md:hidden
"

>

<X/>

</button>




</div>









<nav className="
space-y-3
">


{

links.map((item)=>(


<Link

key={item.url}

href={item.url}

onClick={()=>
setOpen(false)
}

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


{item.icon}


{item.name}


</Link>


))


}



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





</>

);


}
