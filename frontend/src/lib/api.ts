import axios from "axios";


const api = axios.create({

  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/api",

  headers: {

    "Content-Type": "application/json",

  },

});




// REQUEST INTERCEPTOR

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


(error)=>{

return Promise.reject(error);

}


);







// RESPONSE INTERCEPTOR

api.interceptors.response.use(

(response)=>{

return response;

},


(error)=>{


if(error.response?.status===401){


if(typeof window !== "undefined"){

localStorage.removeItem("token");

localStorage.removeItem("user");

}


}



return Promise.reject(error);


}



);





export default api;
