import api from "@/lib/api";




// REGISTER

export async function registerUser(
data:any
){

const res = await api.post(
"/auth/register",
data
);


return res.data;

}






// LOGIN

export async function loginUser(
data:any
){

const res = await api.post(
"/auth/login",
data
);


return res.data;

}






// CURRENT USER

export async function getCurrentUser(){

const res = await api.get(
"/auth/me"
);


return res.data;

}
