import {
    Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Github, Instagram, Linkedin, Twitter
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from './ui/button';


const LeftSidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((store => store.auth));
    const dispatch = useDispatch();
    const { likeNotification } = useSelector(store => store.realTimeNotification);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://psocial.kalehub.com/api/v1/user/logout', {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
        }
    };

    const sidebarHandler = (text) => {
        if (text === 'Logout') {
            logoutHandler();
            return;
        } else if (text === 'Create') {
            setOpen(true);
        } else if (text === 'Profile') {
            navigate(`/profile/${user?._id}`);
        } else if (text === 'Home') {
            navigate('/');
        } else if (text === 'Messages') {
            navigate('/chat');
        }
    };

    const SidebarItems = [
        { icon: <Home />, text: 'Home' },
        { icon: <Search />, text: 'Search' },
        { icon: <TrendingUp />, text: 'Explore' },
        { icon: <MessageCircle />, text: 'Messages' },
        { icon: <Heart />, text: 'Notifications' },
        { icon: <PlusSquare />, text: 'Create' },
        {
            icon: (
                <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profilePicture} alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: 'Profile',
        },
        { icon: <LogOut />, text: 'Logout' },
    ];

    return (
        <div className="fixed top-0 h-screen w-[17%] border-r border-gray-300 bg-white shadow-md z-10 p-6 flex flex-col justify-between">
            {/* Sidebar Items */}
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 cursor-pointer hover:text-blue-500 transition-all">
                    P-Social
                </h1>
                <div className="flex flex-col gap-4">
                    {SidebarItems.map((item, index) => (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            key={index}
                            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition-all cursor-pointer group"
                        >
                            <div className="text-gray-600 group-hover:text-blue-500 transition-all">
                                {item.icon}
                            </div>
                            <p className="text-gray-700 group-hover:text-blue-500 font-medium">
                                {item.text}
                            </p>
                            {
                                item.text === 'Notifications' && likeNotification.length > 0 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                size="icon"
                                                className="text-white bg-red-500 rounded-full absolute h-5 w-5 flex items-center justify-center bottom-6 left-6"
                                            >
                                                {likeNotification.length}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
                                            {likeNotification.length === 0 ? (
                                                <p className="text-center text-gray-500">No notifications</p>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {likeNotification.map((notification) => (
                                                        <div
                                                            key={notification.userId}
                                                            className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg"
                                                        >
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage
                                                                    src={notification.userDetails?.profilePicture || "/default-avatar.png"}
                                                                    alt={`${notification.userDetails?.username}'s profile`}
                                                                />
                                                            </Avatar>
                                                            <p className="text-sm font-medium">
                                                                <span className="font-bold">
                                                                    {notification.userDetails?.username}
                                                                </span>{' '}
                                                                <span className="text-gray-500">liked your post</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                )
                            }

                        </div>
                    ))}
                </div>
            </div>

            {/* Create Post */}
            <CreatePost open={open} setOpen={setOpen} />

            {/* Social Links Footer */}
            <div className="mt-10 text-center">
                <span className="text-gray-500 text-sm mb-2 block">Connect with the developer:</span>
                <div className="flex justify-center space-x-6 items-center mt-4 border-t pt-4 border-gray-200">
                    <a
                        href="https://github.com/PKBOSS26"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-all"
                    >
                        <Github className="w-6 h-6" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/pratik-kale-975b3b216/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700 transition-all"
                    >
                        <Linkedin className="w-6 h-6" />
                    </a>
                    <a
                        href="https://www.instagram.com/kalep_26/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-500 transition-all"
                    >
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a
                        href="https://twitter.com/pratikkale26"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400 transition-all"
                    >
                        <Twitter className="w-6 h-6" />
                    </a>
                </div>
            </div>

        </div>
    );
};

export default LeftSidebar;
