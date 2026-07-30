import {
NextResponse
} from "next/server";


import type {
NextRequest
} from "next/server";








export function middleware(
request: NextRequest
){



const token =
request.cookies.get("token")?.value;





const pathname =
request.nextUrl.pathname;








const protectedRoutes = [

"/dashboard",

"/my-tournaments",

"/deposit",

"/withdraw",

"/profile",

"/settings",

"/matches",

"/leaderboard"

];








const isProtected =
protectedRoutes.some(
(route)=>
pathname.startsWith(route)
);








if(isProtected && !token){



return NextResponse.redirect(

new URL(
"/login",
request.url
)

);


}








return NextResponse.next();


}








export const config = {


matcher:[

"/dashboard/:path*",

"/my-tournaments/:path*",

"/deposit/:path*",

"/withdraw/:path*",

"/profile/:path*",

"/settings/:path*",

"/matches/:path*",

"/leaderboard/:path*"

]


};
