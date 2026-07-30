"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import api from "@/lib/api";


export default function MatchPage() {


  const params = useParams<{ id: string }>();

  const id = params?.id;


  const [match,setMatch] = useState<any>(null);

  const [loading,setLoading] = useState(true);





  useEffect(()=>{


    if(id){

      loadMatch();

    }


  },[id]);







  async function loadMatch(){


    try{


      const res = await api.get(
        `/matches/${id}`
      );


      setMatch(res.data);



    }catch(error){


      console.log(error);



    }finally{


      setLoading(false);


    }


  }







  if(!id || loading){


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

        Loading Match...

      </div>

    );


  }






  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      p-6
      "
    >

      <div
        className="
        max-w-5xl
        mx-auto
        "
      >

        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          🎮 Match Details
        </h1>



        {match && (

          <div
            className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-2xl
            p-6
            "
          >


            <p>
              Match ID: {match.id}
            </p>


            <p>
              Status: {match.status}
            </p>


            <p>
              Room ID: {match.room_id || "Not Added"}
            </p>


            <p>
              Room Password: {match.room_password || "Not Added"}
            </p>


          </div>

        )}



      </div>


    </div>

  );


}
