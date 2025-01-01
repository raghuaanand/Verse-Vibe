import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const client = new PrismaClient();

export async function GET() {
  try {
    const posts = await client.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
