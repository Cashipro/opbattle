"use client";


import {
useState
} from "react";


import {
useRouter
} from "next/navigation";


import api from "@/lib/api";







export default function Login(){



const router = useRouter();


const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);








async function handleLogin(e:any){


e.preventDefault();


try{


setLoading(true);



const res = await api.post(
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







router.push(
"/dashboard"
);





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
p-6
md:p-8
">






<h1 className="
text-3xl
font-black
text-center
text-green-400
mb-2
">

TOURNAMENT HUB

</h1>






<p className="
text-gray-400
text-center
mb-8
">

Login to your account

</p>








<form

onSubmit={handleLogin}

className="
space-y-5
"

>







<div>


<label className="
text-gray-400
block
mb-2
">

Email

</label>


<input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

placeholder="Enter email"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

required

/>


</div>








<div>


<label className="
text-gray-400
block
mb-2
">

Password

</label>


<input

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

placeholder="Enter password"

className="
w-full
bg-zinc-800
rounded-xl
p-4
outline-none
"

required

/>


</div>








<button

disabled={loading}

className="
w-full
bg-green-600
py-4
rounded-xl
font-black
hover:bg-green-700
disabled:opacity-50
"

>

{

loading

?

"Logging in..."

:

"Login"

}

</button>








</form>








<p className="
text-center
text-gray-400
mt-6
">

Don't have account?

{" "}

<a

href="/register"

className="
text-green-400
font-bold
"

>

Register

</a>

</p>








</div>






</main>

);


}
