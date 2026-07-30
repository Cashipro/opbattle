"use client";


import {
useRouter
} from "next/navigation";


import Sidebar from "@/components/Sidebar";







export default function Settings(){



const router = useRouter();








function logout(){


localStorage.removeItem("token");

localStorage.removeItem("user");


router.push("/login");


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
max-w-3xl
mx-auto
">






<h1 className="
text-3xl
md:text-4xl
font-black
mb-8
">

⚙ Settings

</h1>








<div className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
space-y-6
">








<div>

<h2 className="
text-xl
font-bold
mb-3
">

Account Security

</h2>



<input

type="password"

placeholder="Current Password"

className="
w-full
bg-zinc-800
rounded-xl
p-4
mb-3
outline-none
"

/>





<input

type="password"

placeholder="New Password"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

/>



<button

className="
mt-4
bg-blue-600
px-6
py-3
rounded-xl
font-bold
"

>

Update Password

</button>



</div>









<div className="
border-t
border-zinc-800
pt-6
">





<h2 className="
text-xl
font-bold
mb-3
">

Account Actions

</h2>






<button

onClick={logout}

className="
w-full
bg-red-600
py-4
rounded-xl
font-black
hover:bg-red-700
"

>

🚪 Logout

</button>






</div>








</div>








</div>





</main>






</div>

);


}
