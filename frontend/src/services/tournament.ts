import api from "@/lib/api";







export async function getTournaments(){


const res = await api.get(

"/tournaments"

);


return res.data;


}









export async function getTournament(

id:string

){


const res = await api.get(

`/tournaments/${id}`

);


return res.data;


}









export async function joinTournament(

id:string

){


const res = await api.post(

`/tournaments/${id}/join`

);


return res.data;


}









export async function getMyTournaments(){


const res = await api.get(

"/tournaments/user/my-tournaments"

);


return res.data;


}









export async function getTeamRoom(

id:string

){


const res = await api.get(

`/tournaments/${id}/team-room`

);


return res.data;


}









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









export async function leaveSlot(

slotId:string

){


const res = await api.post(

"/tournaments/team/leave-slot",

{

slotId

}

);


return res.data;


}









export async function getTournamentMatches(

id:string

){


const res = await api.get(

`/tournaments/${id}/matches`

);


return res.data;


}
