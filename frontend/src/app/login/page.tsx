"use client";


import {
useState
} from "react";


import {
useRouter
} from "next/navigation";


import Link from "next/link";


import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";


import {
loginUser
} from "@/services/auth";





export default function LoginPage(){


const router=useRouter();



const [form,setForm]=useState({

email:"",

password:""

});



const [loading,setLoading]=useState(false);







function change(e:any){


setForm({

...form,

[e.target.name]:e.target.value


});


}








async function submit(e:any){


e.preventDefault();



try{


setLoading(true);



const res =
await loginUser(form);





localStorage.setItem(

"token",

res.token

);





localStorage.setItem(

"user",

JSON.stringify(res.user)

);






alert(
"Login Successful"
);




router.push("/dashboard");





}

catch(error:any){


alert(

error.response?.data?.message ||
"Login Failed"

);


}

finally{


setLoading(false);


}



}







return(

<>


<Navbar />



<main className="min-h-screen flex items-center justify-center">



<form

onSubmit={submit}

className="game-card w-full max-w-lg p-8 space-y-5"

>



<div className="text-center">


<h1 className="text-3xl font-black">

Welcome Back

</h1>


<p className="text-gray-400 mt-2">

Login to your OpBattle account

</p>


</div>







<input


name="email"

type="email"

placeholder="Email Address"

value={form.email}

onChange={change}

className="input"

required


/>






<input


name="password"

type="password"

placeholder="Password"

value={form.password}

onChange={change}

className="input"

required


/>







<button

className="btn-primary w-full"

disabled={loading}

>


{

loading

?

"Logging in..."

:

"Login"

}


</button>








<p className="text-center text-gray-400">


Don't have account?


<Link

href="/register"

className="text-[#00ff84] ml-2"

>

Register

</Link>


</p>





</form>



</main>



<Footer />



</>


);


}
