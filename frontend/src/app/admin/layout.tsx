import AdminSidebar from "./components/AdminSidebar";


export default function AdminLayout({

children,

}: {

children: React.ReactNode;

}) {


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
