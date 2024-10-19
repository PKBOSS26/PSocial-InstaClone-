import {
    Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Github, Instagram, Linkedin, Twitter
} from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
];

const LeftSidebar = () => {
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', {
                withCredentials: true,
            });
            if (res.data.success) {
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
        }
        navigate(`/${text}`);
    };

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
                        </div>
                    ))}
                </div>
            </div>

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
