"use client";

import {
  useEffect,
  useState
} from "react";

import api from "@/lib/api";

import {
  Users,
  Crown,
  Shield
} from "lucide-react";



export default function AdminTeamsPage(){


const [teams,setTeams] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);







useEffect(()=>{

loadTeams();

},[]);







async function loadTeams(){


try{


const res =
await api.get(
"/admin/teams"
);



setTeams(
res.data || []
);



}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}








return (

<div className="
space-y-8
">





<div>


<h1 className="
text-4xl
font-black
flex
items-center
gap-3
">

<Users className="text-green-500"/>

Teams

</h1>



<p className="
text-zinc-400
mt-2
">

Manage registered teams and players

</p>



</div>







<div className="
grid
gap-6
">


{

loading

?

<p className="text-zinc-400">
Loading teams...
</p>


:


teams.map((team:any)=>(



<div

key={team.id}

className="
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
"

>



<div className="
flex
justify-between
items-center
mb-5
">



<div>

<h2 className="
text-2xl
font-black
flex
items-center
gap-2
">


<Shield className="text-blue-500"/>


{team.name}


</h2>


<p className="
text-zinc-400
mt-1
">

Captain:
{" "}

{team.captain?.name || "Not Assigned"}

</p>


</div>




<div className="
bg-zinc-800
px-4
py-2
rounded-xl
">

Slots:
{" "}
{team.slots?.length || 0}

</div>


</div>
            <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-4
          ">


          {
          
          team.slots?.map((slot:any)=>(


            <div

            key={slot.id}

            className="
            bg-zinc-800
            rounded-2xl
            p-4
            "

            >


              <p className="
              text-zinc-400
              text-sm
              "
              >

              Slot {slot.slot_number}

              </p>



              {
              
              slot.player

              ?

              <div className="
              mt-2
              "
              >

                <p className="
                font-bold
                text-green-400
                "
                >

                {slot.player.name}

                </p>


                <p className="
                text-sm
                text-zinc-400
                "
                >

                PUBG:
                {" "}
                {slot.player.pubg_uid}

                </p>


              </div>


              :


              <p className="
              mt-2
              text-zinc-500
              "
              >

              Empty

              </p>


              }


            </div>


          ))


          }



          </div>






          {
          
          team.members &&

          <div className="
          mt-6
          "
          >


            <h3 className="
            font-black
            text-xl
            mb-3
            flex
            items-center
            gap-2
            ">


            <Crown className="text-yellow-400"/>

            Members


            </h3>



            <div className="
            flex
            flex-wrap
            gap-3
            ">


            {
            
            team.members.map((member:any)=>(


              <div

              key={member.id}

              className="
              bg-zinc-800
              px-4
              py-3
              rounded-xl
              "

              >

              {member.player?.name || "Player"}

              </div>


            ))


            }


            </div>


          </div>


          }




        </div>


      ))


      }



      </div>


    </div>

);

}
