import api from "@/lib/api";





// GET ALL TOURNAMENTS

export async function getTournaments(){

    const res = await api.get("/tournaments");

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








// GET MY TOURNAMENTS

export async function getMyTournaments(){

    const res = await api.get(
        "/tournaments/user/my-tournaments"
    );

    return res.data;

}








// GENERATE TEAMS

export async function generateTeams(

    id:string

){

    const res = await api.post(
        `/tournaments/${id}/generate-teams`
    );

    return res.data;

}
