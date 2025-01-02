import axios from "axios";
import { useEffect, useState } from "react";


export interface Blog {
    content: string;
    title: string;
    id: string;
    author: {
      name: string;
    };
}


export const useBlog = ({ id }: { id: string }) => {
    const [ loading, setLoading ] = useState(true);
    const [ blog, setBlog ] = useState<Blog>();

    useEffect(() => {
        axios.get(`/api/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
        .then((res) => {
            setBlog(res.data);
            setLoading(false);
        });
    }, [id]);

    return {
        loading,
        blog,
    };
};


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    useEffect(() => {
      axios
        .get(`/api/blogs`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setLoading(false);
          setBlogs(response.data.post);
        });
    }, []);
  
    return {
      loading,
      blogs,
    };
  };