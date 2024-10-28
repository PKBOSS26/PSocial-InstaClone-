import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/user/${userId}/profile`, 
          { withCredentials: true }
        );

        if (res.data.success && isMounted) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    if (userId) {
      fetchUserProfile();
    }

    // Cleanup function to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [userId, dispatch]); // Add userId to dependencies
};

export default useGetUserProfile;
