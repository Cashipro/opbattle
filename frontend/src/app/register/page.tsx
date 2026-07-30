"use client";


import {
useState
} from "react";


import {
useRouter
} from "next/navigation";


import api from "@/lib/api";







export default function Register(){



const router = useRouter();


const [name,setName] = useState("");

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [pubg_uid,setPubgUid] = useState("");

const [loading,setLoading] = useState(false);








async function handleRegister(e:any){


e.preventDefault();



try{


setLoading(true);



await api.post(

"/auth/register",

{

name,

email,

password,

pubg_uid

}

);





alert(
"Registration successful"
);



router.push(
"/login"
);





}catch(error:any){


alert(

error?.response?.data?.message ||

"Registration failed"

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

Create your player account

</p>









<form

onSubmit={handleRegister}

className="
space-y-4
"

>








<div>

<label className="
text-gray-400
block
mb-2
">

Name

</label>


<input

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Enter name"

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

PUBG UID

</label>


<input

value={pubg_uid}

onChange={(e)=>setPubgUid(e.target.value)}

placeholder="Enter PUBG UID"

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

placeholder="Create password"

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

"Creating..."

:

"Register"

}

</button>








</form>








<p className="
text-center
text-gray-400
mt-6
">

Already have account?

{" "}

<a

href="/login"

className="
text-green-400
font-bold
"

>

Login

</a>

</p>








</div>






</main>

);


}
