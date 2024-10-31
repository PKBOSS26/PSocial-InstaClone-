import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.auth)

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                "https://psocial.kalehub.com/api/v1/user/login",
                input,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                })
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user){
            navigate("/");
        }
    }, [])
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form
                onSubmit={loginHandler}
                className="shadow-lg flex flex-col gap-5 p-8 w-96 rounded-md"
            >
                <div className="my-4 text-center">
                    <h1 className="text-2xl font-semibold">P-Social</h1>
                    <p className="text-sm text-gray-500">Login to continue</p>
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={(e) => setInput({ ...input, email: e.target.value })}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={(e) => setInput({ ...input, password: e.target.value })}
                        placeholder="Enter your password"
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>

                <span className="text-center">Don't have an account? <Link className="text-blue-500" to="/signup" >Signup</Link></span>
            </form>
        </div>
    );
};

export default Login;
