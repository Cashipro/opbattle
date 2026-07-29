import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";



export function middleware(
request:NextRequest
){


const token =
request.cookies.get("token")?.value;



const protectedRoutes=[

"/dashboard",

"/my-tournaments",

"/profile"

];



const path =
request.nextUrl.pathname;




if(

protectedRoutes.some(

(route)=>path.startsWith(route)

)

){


if(!token){


return NextResponse.redirect(

new URL("/login",request.url)

);


}



}



return NextResponse.next();


}





export const config={


matcher:[

"/dashboard/:path*",

"/my-tournaments/:path*",

"/profile/:path*"

]


};
