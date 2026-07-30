"use client";


import {
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import api from "@/lib/api";







export default function AdminLogin(){



const router = useRouter();



const [email,setEmail] =
useState("");



const [password,setPassword] =
useState("");



const [loading,setLoading] =
useState(false);








async function login(e:any){


e.preventDefault();



try{


setLoading(true);



const res =
await api.post(

"/auth/login",

{

email,

password

}

);







const token =
res.data.access_token ||
res.data.token;



const user =
res.data.user;






if(

user?.role !== "admin"

){


alert(
"Admin access only"
);


return;


}







localStorage.setItem(

"token",

token

);



localStorage.setItem(

"user",

JSON.stringify(user)

);







document.cookie =

`token=${token}; path=/; max-age=86400`;







router.push("/admin");





}catch(error:any){



alert(

error?.response?.data?.message ||

"Login failed"

);



}finally{


setLoading(false);


}



}
  return (

<main className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
p-5
">






<div className="
w-full
max-w-md
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-8
">





<h1 className="
text-3xl
font-black
text-center
text-green-400
mb-2
">

OPBATTLE ADMIN

</h1>



<p className="
text-zinc-400
text-center
mb-8
">

Administrator Login

</p>







<form

onSubmit={login}

className="
space-y-5
"

>






<div>


<label className="
block
text-zinc-400
mb-2
">

Email

</label>


<input

type="email"

required

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

placeholder="Admin email"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

 />


</div>









<div>


<label className="
block
text-zinc-400
mb-2
">

Password

</label>



<input

type="password"

required

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

placeholder="Password"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

 />


</div>









<button

disabled={loading}

className="
w-full
bg-green-600
hover:bg-green-700
py-4
rounded-xl
font-black
"

>


{

loading

?

"Checking..."

:

"LOGIN AS ADMIN"

}



</button>







</form>






</div>






</main>

);


}
