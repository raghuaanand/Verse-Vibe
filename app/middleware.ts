import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function Middleware(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");

    try {
        if (!authHeader) {
            return NextResponse.json({
                message: "No token provided"
            }, {
                status: 401
            })
        }

        const token = authHeader;

        const payload = jwt.verify(token, process.env.JWT_SECRET!);

        if (!payload || typeof payload !== "object" || !payload.id) {
            return NextResponse.json(
                { error: "unauthorized" },
                { status: 403 }
            );
        }

        // Pass the user ID in the request headers for downstream handlers
        const res = NextResponse.next();
        res.headers.set("user-id", payload.id as string);
        return res;
    }catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Invalid token"

        }, {
            status: 401
        })
    }
}


export const config = {
    matcher: "/api/blog/*",
}