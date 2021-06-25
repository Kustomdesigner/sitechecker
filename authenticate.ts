import {Context} from "https://deno.land/x/oak/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import "https://deno.land/x/dotenv/load.ts";

export async function authenticateUser(ctx: Context, next: any) {
  try {
    const jwt = getCookies(ctx.request);
    const token: string = jwt.authorization;  
    const secret:string = Deno.env.get('JWT_SECRET') || "";

    const payload = await verify(token, secret, "HS512"); 
    
    if(payload) {

      console.log('middleware ran!');
      await next();

      ctx.response.status = 200
      ctx.response.body = {
        "message" : "ok"
      }

    } else {
      ctx.response.status = 401
      ctx.response.body = {
        "message" : "Unauthorized User"
      }
    }

  } catch(err) {
    console.error(err);
  }

}
