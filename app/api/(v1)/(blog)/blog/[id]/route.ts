import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateBlogInput } from "@/utils/schemas/blog";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract blog post ID from the URL
    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { success, data } = updateBlogInput.safeParse(body);

    if (!success) {
      return NextResponse.json({ message: "Invalid inputs" }, { status: 411 });
    }

    const { title, content } = data;

    // Update the blog post, ensuring ownership
    const updatedPost = await prisma.post.updateMany({
      where: {
        id: id, // Blog post ID from URL
        authorId: payload.id, // Ensure the user owns this post
      },
      data: {
        title,
        content,
      },
    });

    if (updatedPost.count === 0) {
      // No rows updated: either post not found or user doesn't own it
      return NextResponse.json(
        { message: "Blog post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);

    return NextResponse.json(
      { message: "Failed to update post" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
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

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

