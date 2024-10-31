import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Home /> },  // Default route
      { path: "profile/:id", element: <Profile /> },
      { path: "account/:id", element: <EditProfile /> },
      { path: "chat", element: <ChatPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;

    if (user) {
      socketio = io("https://psocial.kalehub.com", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listen for online users event
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      // Handle socket errors
      socketio.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      // Clean up on component unmount or user logout
      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    } else {
      socket?.disconnect();
      dispatch(setSocket(null));
    }

    // Clean up if no user is logged in
    return () => {
      if (socketio) socketio.disconnect();
    };
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
