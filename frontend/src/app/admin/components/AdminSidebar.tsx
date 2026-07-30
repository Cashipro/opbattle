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



export default function AdminSidebar(){



const menu = [

{
name:"Dashboard",
path:"/admin",
icon:LayoutDashboard
},


{
name:"Tournaments",
path:"/admin/tournaments",
icon:Trophy
},


{
name:"Matches",
path:"/admin/matches",
icon:Swords
},


{
name:"Teams",
path:"/admin/teams",
icon:Users
},


{
name:"Results",
path:"/admin/results",
icon:Medal
}



];







return (

<aside className="
w-72
min-h-screen
bg-zinc-950
border-r
border-zinc-800
p-6
fixed
left-0
top-0
">




<h1 className="
text-3xl
font-black
text-green-400
mb-10
">

OPBATTLE ADMIN

</h1>






<nav className="
space-y-3
">


{
menu.map((item:any)=>{


const Icon = item.icon;


return (

<Link

key={item.path}

href={item.path}

className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
bg-zinc-900
hover:bg-green-600
transition
font-bold
"

>


<Icon className="w-5 h-5"/>


{item.name}


</Link>


);


})


}


</nav>
        <button

      onClick={()=>{

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href="/login";

      }}

      className="
      mt-10
      w-full
      flex
      items-center
      justify-center
      gap-3
      bg-red-600
      hover:bg-red-700
      rounded-xl
      py-3
      font-bold
      "

      >

      <LogOut className="w-5 h-5"/>

      Logout

      </button>




    </aside>

);


}
