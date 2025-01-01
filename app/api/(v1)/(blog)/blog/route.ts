import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createBlogInput } from "@/utils/schemas/blog";

const client  = new PrismaClient();

export async function POST(req: NextRequest){
    try{
        const authHeader = req.headers.get("Authorization");

        if(!authHeader){
            return NextResponse.json({
                message: "unauthorized"
            }, {
                status: 401
            })
        }

        const token  = authHeader.replace("Bearer ", "");

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        if(!payload || !payload.id){
            return NextResponse.json({
                message: "unauthorized"
            }, {
                status: 403
            })            
        }


        const body = await req.json();
        const { success } = createBlogInput.safeParse(body);

        if(!success){
            return NextResponse.json({
                message: "Invalid inputs",
            }, {
                status: 400
            })
        }

        const { title, content } = body;

        const post = await client.post.create({
            data: {
                title,
                content,
                authorId: payload.id
            }
        })

        return NextResponse.json({
            id: post.id,
        })
    }catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, {
            status: 500
        })
    }
}


