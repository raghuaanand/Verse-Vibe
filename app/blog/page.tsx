'use client'
import { Appbar } from "@/components/Appbar";
import { FullBlog } from "@/components/FullBlog";
import { Skeleton } from "@/components/Skeleton";
import { useBlog } from "@/hooks";
import { useParams } from "next/navigation";

export default function Blog()  {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id.join("") : id;
  const { loading, blog } = useBlog({
    id: blogId || "",
  });
  if (loading || !blog) {
    return (
      <div>
        <Appbar />
        <div className="mt-16 flex justify-center">
          <Skeleton />
        </div>
      </div>
    );
  }
  return (
    <div>
      <FullBlog blog={blog} />
    </div>
  );
};
