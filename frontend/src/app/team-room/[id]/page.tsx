"use client";


import {
useEffect,
useState
} from "react";


import {
useParams,
useRouter
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import {
getTeamRoom,
selectSlot
} from "@/services/tournament";








export default function TeamRoomPage(){


const params = useParams<{id:string}>() || {};

const router = useRouter();


const id = params.id;





const [teams,setTeams] = useState<any[]>([]);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");









useEffect(()=>{


if(id){

loadRoom();

}


},[id]);









async function loadRoom(){


try{


if(!id){

return;

}



const data = await getTeamRoom(id);


setTeams(data);



}catch(err:any){


setError(

err?.response?.data?.message ||

"You cannot access this room"

);



}finally{


setLoading(false);


}


}









async function handleSlot(slotId:string){


try{


await selectSlot(slotId);


await loadRoom();



}catch(err:any){


alert(

err?.response?.data?.message ||

"Slot unavailable"

);


}



}









if(loading){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
">

Loading PUBG Room...

</div>

);


}









if(error){


return (

<div className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
p-5
">


<div className="
bg-zinc-900
border
border-red-700
rounded-3xl
p-8
