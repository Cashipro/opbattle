import axios from "axios";


const api = axios.create({

baseURL:
process.env.NEXT_PUBLIC_API_URL ||
"https://opbattle-production.up.railway.app",


headers:{

"Content-Type":"application/json"

}


});






api.interceptors.request.use(

(config)=>{


const token =
typeof window !== "undefined"
?
localStorage.getItem("token")
:
null;



if(token){


config.headers.Authorization =
`Bearer ${token}`;


}



return config;


},


(error)=>

Promise.reject(error)

);







api.interceptors.response.use(


(response)=>

response,


(error)=>{


if(error.response?.status===401){


console.log(
"JWT ERROR:",
error.response.data
);


}


return Promise.reject(error);


}


);






export default api;
