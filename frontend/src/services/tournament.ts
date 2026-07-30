import api from "@/lib/api";





// GET ALL TOURNAMENTS

export async function getTournaments(){


const res = await api.get(
"/tournaments"
);


return res.data;


}









// GET SINGLE TOURNAMENT

export async function getTournament(

id:string

){


const res = await api.get(

`/tournaments/${id}`

);


return res.data;


}









// JOIN TOURNAMENT

export async function joinTournament(

id:string

){


const res = await api.post(

`/tournaments/${id}/join`

);


return res.data;


}









// MY TOURNAMENTS

export async function getMyTournaments(){


const res = await api.get(

"/tournaments/user/my-tournaments"

);


return res.data;


}









// TEAM ROOM

export async function getTeamRoom(

id:string

){


const res = await api.get(

`/tournaments/${id}/team-room`

);


return res.data;


}









// SELECT SLOT

export async function selectSlot(

slotId:string

){


const res = await api.post(

"/tournaments/team/select-slot",

{


slotId


}


);


return res.data;


}









// LEAVE SLOT

export async function leaveSlot(){


const res = await api.post(

"/tournaments/team/leave-slot"

);


return res.data;


}
