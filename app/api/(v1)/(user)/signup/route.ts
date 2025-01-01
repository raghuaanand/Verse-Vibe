import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { signupInput } from "@/utils/schemas/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = signupInput.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ message: "Invalid inputs", errors: parseResult.error.errors }, { status: 400 });
    }

    const { email, password, name } = parseResult.data;

    const user = await prisma.user.create({
      data: { email, password, name },
    });

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Token expiration time
    });

    return NextResponse.json({ token: jwtToken }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
