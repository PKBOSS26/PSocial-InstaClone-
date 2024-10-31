import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get("https://psocial.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        } else {
          console.error("No posts found");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUsers
