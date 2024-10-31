import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        if (!selectedUser?._id) return; // Prevent API call if selectedUser is undefined

        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(
                    `https://psocial.onrender.com/api/v1/message/all/${selectedUser._id}`,
                    { withCredentials: true }
                );
                console.log('Fetched Messages:', res.data); // Debugging log
                if (res.data.success) {
                    dispatch(setMessages(res.data.msgs));
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchAllMessage();
    }, [selectedUser?._id]); // Use _id to trigger the effect only when it changes    
};
export default useGetAllMessage;