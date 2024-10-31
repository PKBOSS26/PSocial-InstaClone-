import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("https://psocial.kalehub.com/api/v1/post/all", {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        } else {
          console.error("No posts found");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
