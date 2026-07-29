"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


export default function RegisterPage(){

return(

<>

<Navbar />


<main className="min-h-screen flex items-center justify-center py-20">


<div className="w-full max-w-lg game-card p-8">



<div className="text-center mb-8">


<div className="w-20 h-20 rounded-3xl bg-[#00FF84] flex items-center justify-center text-black font-black text-3xl mx-auto">

O

</div>



<h1 className="text-3xl font-black mt-6">

Create Account

</h1>



<p className="text-gray-400 mt-2">

Join OpBattle PUBG Tournament Platform

</p>



</div>







<form className="space-y-5">



<Input

label="Full Name"

type="text"

placeholder="Enter your name"

/>




<Input

label="Email Address"

type="email"

placeholder="Enter your email"

/>





<Input

label="PUBG UID"

type="text"

placeholder="Enter PUBG ID"

/>





<Input

label="Password"

type="password"

placeholder="Create password"

/>





<Input

label="Confirm Password"

type="password"

placeholder="Confirm password"

/>






<Button

title="Create Account"

className="w-full"

/>





</form>







<div className="text-center mt-8">


<p className="text-gray-400">

Already have an account?

</p>



<Link

href="/login"

className="text-[#00FF84] font-bold mt-2 inline-block"

>

Login Now

</Link>



</div>




</div>


</main>



<Footer />

</>

);

}
