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



},[]);








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
