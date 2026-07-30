import axios from "axios";



const API = process.env.NEXT_PUBLIC_API_URL;







// GET TOURNAMENT DETAIL

export async function getTournament(

id:string

){

const res = await axios.get(

`${API}/tournaments/${id}`,

{
withCredentials:true
}

);


return res.data;


}









// JOIN TOURNAMENT

export async function joinTournament(

id:string

){


const res = await axios.post(

`${API}/tournaments/${id}/join`,

{},

{

withCredentials:true

}

);



return res.data;


}









// GET PUBG TEAM ROOM

export async function getTeamRoom(

id:string

){


const res = await axios.get(

`${API}/tournaments/${id}/team-room`,

{

withCredentials:true

}

);



return res.data;


}









// SELECT SLOT

export async function selectSlot(

slotId:string

){


const res = await axios.post(

`${API}/tournaments/team/select-slot`,

{

slotId

},


{

withCredentials:true

}


);



return res.data;


}









// LEAVE SLOT

export async function leaveSlot(

slotId:string

){


const res = await axios.post(

`${API}/tournaments/team/leave-slot`,

{

slotId

},


{

withCredentials:true

}


);



return res.data;


}
