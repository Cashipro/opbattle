"use client";


import {
useState
} from "react";


import {
registerUser
} from "@/services/auth";


import {
useRouter
} from "next/navigation";



import Link from "next/link";



import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";



export default function RegisterPage(){



const router=useRouter();



const [form,setForm]=useState({

name:"",

email:"",

pubg_uid:"",

password:""


});



const [loading,setLoading]=useState(false);





function change(
e:any
){


setForm({

...form,

[e.target.name]:e.target.value

});


}






async function submit(
e:any
){


e.preventDefault();


try{


setLoading(true);



await registerUser(form);



alert(
"Account Created Successfully"
);



router.push("/login");



}

catch(error:any){


alert(

error.response?.data?.message ||
"Registration Failed"

);


}

finally{


setLoading(false);


}



}





return(

<>


<Navbar />



<div className="min-h-screen flex items-center justify-center">


<form

onSubmit={submit}

className="game-card w-full max-w-lg p-8 space-y-5"

>



<h1 className="text-3xl font-bold">

Create Account

</h1>



<input

name="name"

placeholder="Full Name"

onChange={change}

className="input"

required

/>



<input

name="email"

placeholder="Email"

type="email"

onChange={change}

className="input"

required

/>



<input

name="pubg_uid"

placeholder="PUBG UID"

onChange={change}

className="input"

required

/>



<input

name="password"

placeholder="Password"

type="password"

onChange={change}

className="input"

required

/>



<button

disabled={loading}

className="btn-primary w-full"

>


{
loading
?
"Creating..."
:
"Create Account"
}


</button>




<p>

Already have account?

<Link

href="/login"

className="text-[#00ff84]"

>

 Login

</Link>


</p>



</form>



</div>



<Footer />

</>


);


}
