import { signinInput } from "@/utils/schemas/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = signinInput.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Invalid inputs", errors: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const user = await client.user.findUnique({
      where: {
        email,
        password, 
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 403 }
      );
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      message: "Successfully signed in",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error in POST /signin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
