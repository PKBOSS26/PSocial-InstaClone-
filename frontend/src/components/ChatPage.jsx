import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { toast } from 'sonner';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const { user, SuggestedUsers = [], selectedUser } = useSelector((store) => store.auth);
    const { onlineUsers = [], messages = [] } = useSelector((store) => store.chat);
    const dispatch = useDispatch();

    // Reset selected user on component unmount
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, [dispatch]);

    const sendMessageHandler = useCallback(
        async (receiverId) => {
            if (!textMessage.trim()) return; // Avoid sending empty messages.

            try {
                const res = await axios.post(
                    `http://localhost:3000/api/v1/message/send/${receiverId}`,
                    { textMessage: textMessage },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                );

                // Log the entire response to inspect its structure
                console.log('API Response:', res.data);

                if (res.data.success) {
                    dispatch(setMessages([...messages, res.data.newMessage])); // Here you need to check if newMessage is defined
                    setTextMessage('');
                } else {
                    console.error('Error sending message:', res.data.message);
                }
            } catch (err) {
                console.error('Failed to send message:', err);
                toast.error('Failed to send message');
            }
        },
        [textMessage, messages, dispatch]
    );


    return (
        <div className='flex ml-[18%] h-screen'>
            {/* Left Sidebar: Suggested Users */}
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {SuggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
                            >
                                <Avatar className='w-14 h-14'>
                                    <AvatarImage src={suggestedUser?.profilepicture} />
                                    <AvatarFallback>
                                        {suggestedUser?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span
                                        className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {isOnline ? 'online' : 'offline'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Right Section: Chat Interface */}
            {selectedUser ? (
                <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                    {/* Header: Selected User Info */}
                    <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                        <Avatar>
                            <AvatarImage src={selectedUser?.profilepicture} alt='profile' />
                            <AvatarFallback>
                                {selectedUser?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>

                    {/* Messages List */}
                    <Messages selectedUser={selectedUser} />

                    {/* Message Input */}
                    <div className='flex items-center p-4 border-t border-t-gray-300'>
                        <Input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            type='text'
                            className='flex-1 mr-2 focus-visible:ring-transparent'
                            placeholder='Messages...'
                        />
                        <Button
                            onClick={() => sendMessageHandler(selectedUser?._id)}
                            disabled={!textMessage.trim()} // Disable if no text
                        >
                            Send
                        </Button>
                    </div>
                </section>
            ) : (
                <div className='flex flex-col items-center justify-center mx-auto'>
                    <MessageCircleCode className='w-32 h-32 my-4' />
                    <h1 className='font-medium'>Your messages</h1>
                    <span>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
