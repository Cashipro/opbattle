"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import AdminSidebar from "./components/AdminSidebar";






export default function AdminLayout({

children

}:{

children:React.ReactNode

}){



const router = useRouter();


const [checking,setChecking] =
useState(true);








useEffect(()=>{



const pathname =
window.location.pathname;





// Admin login page ko protect nahi karna

if(pathname === "/admin/login"){


setChecking(false);


return;


}








const token =
localStorage.getItem("token");



const user =
JSON.parse(

localStorage.getItem("user") || "{}"

);







if(!token){


router.push("/login");


return;


}







if(

user.role !== "admin"

){


router.push("/dashboard");


return;


}






setChecking(false);



},[router]);








if(checking){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
">

Checking admin access...

</div>

);


}







// Admin login page ke liye sidebar nahi dikhana

if(
window.location.pathname === "/admin/login"
){


return (

<>

{children}

</>

);


}









return (

<div className="
min-h-screen
bg-black
text-white
flex
">


<AdminSidebar />





<main className="
flex-1
ml-72
p-6
md:p-10
">


{children}


</main>





</div>

);


}
