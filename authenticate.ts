import {Context } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";
import "https://deno.land/x/dotenv/load.ts";

export async function authenticateUser(ctx: Context, next: any) {
  try {
    const jwt = getCookies(ctx.request);
    const token: string = jwt.authorization || "";  
    const secret:string = Deno.env.get('JWT_SECRET') || "";

    if(token != "" || token != null || token != undefined) {
        const payload = await verify(token, secret, "HS512"); 
          if(payload) await next();
      } else {
        ctx.response.status = 401;
        ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/unauthorized.ejs`, {});
    }
    
  } catch(err) {
    ctx.response.status = 401;
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/unauthorized.ejs`, {});
  }

}
