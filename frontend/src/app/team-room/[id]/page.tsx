"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useParams
} from "next/navigation";


import Sidebar from "@/components/Sidebar";


import {
  getTeamRoom,
  selectSlot,
  leaveSlot
} from "@/services/tournament";








export default function TeamRoom(){


  const params = useParams<{id:string}>();


  const id = params?.id;





  const [teams,setTeams] = useState<any[]>([]);

  const [loading,setLoading] = useState(true);









  useEffect(()=>{


    if(id){

      loadRoom();

    }


  },[id]);









  async function loadRoom(){


    try{


      if(!id) return;


      const data = await getTeamRoom(id);


      setTeams(data);



    }catch(error){


      console.log(error);



    }finally{


      setLoading(false);


    }


  }









  async function chooseSlot(slotId:string){


    try{


      await selectSlot(slotId);


      loadRoom();



    }catch(error:any){


      alert(

        error?.response?.data?.message ||

        "Slot unavailable"

      );


    }



  }









  async function removeSlot(slotId:string){


    try{


      await leaveSlot(slotId);


      loadRoom();



    }catch(error){


      console.log(error);


    }



  }









  if(loading){


    return (

      <div
        className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        "
      >

        Loading Room...

      </div>

    );


  }









  return (

    <div
      className="
      flex
      min-h-screen
      bg-black
      text-white
      "
    >




      <Sidebar />







      <main
        className="
        flex-1
        p-4
        pt-20
        md:p-10
        "
      >





        <div
          className="
          max-w-7xl
          mx-auto
          "
        >





          <h1
            className="
            text-3xl
            md:text-5xl
            font-black
            mb-8
            "
          >

            🎮 PUBG Tournament Room

          </h1>









          <div
            className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
            "
          >





          {
            teams.map((team:any)=>(


              <div
                key={team.id}
                className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-3xl
                p-5
                "
              >





                <h2
                  className="
                  text-2xl
                  font-black
                  mb-5
                  flex
                  justify-between
                  "
                >

                  <span>
                    {team.name}
                  </span>


                  <span className="
                  text-green-400
                  text-sm
                  "
                  >

                    Team {team.team_number}

                  </span>


                </h2>









                <div
                  className="
                  grid
                  grid-cols-2
                  gap-4
                  "
                >





                {
                  team.slots?.map((slot:any)=>(



                    <div
                      key={slot.id}
                      className="
                      bg-zinc-800
                      rounded-2xl
                      p-4
                      min-h-[130px]
                      flex
                      flex-col
                      justify-between
                      "
                    >





                      <div>


                        <p
                          className="
                          text-gray-400
                          text-sm
                          "
                        >

                          Slot {slot.slot_number}

                        </p>





                        {
                          slot.user

                          ?

                          <div
                          className="
                          mt-3
                          "
                          >

                            <p
                            className="
                            font-bold
                            text-green-400
                            "
                            >

                              👑 {slot.user.name}

                            </p>


                            <p
                            className="
                            text-xs
                            text-gray-400
                            "
                            >

                              {slot.user.pubg_uid}

                            </p>


                          </div>


                          :

                          <p
                          className="
                          text-gray-500
                          mt-5
                          "
                          >

                            Empty 👤

                          </p>


                        }



                      </div>









                      {

                        slot.user

                        ?

                        <button

                        onClick={()=>removeSlot(slot.id)}

                        className="
                        mt-3
                        bg-red-600
                        rounded-xl
                        py-2
                        text-sm
                        font-bold
                        "

                        >

                          Leave

                        </button>


                        :

                        <button

                        onClick={()=>chooseSlot(slot.id)}

                        className="
                        mt-3
                        bg-green-600
                        rounded-xl
                        py-2
                        text-sm
                        font-bold
                        "

                        >

                          Join Slot

                        </button>


                      }






                    </div>



                  ))

                }




                </div>






              </div>


            ))
          }







          </div>







        </div>






      </main>






    </div>

  );


}
