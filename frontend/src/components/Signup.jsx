import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useSelector(store => store.auth)

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:3000/api/v1/user/signup",
                input,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }finally {
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
                onSubmit={signupHandler} 
                className="shadow-lg flex flex-col gap-5 p-8 w-96 rounded-md"
            >
                <div className="my-4 text-center">
                    <h1 className="text-2xl font-semibold">P-Social</h1>
                    <p className="text-sm text-gray-500">Signup to continue</p>
                </div>

                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={(e) => setInput({ ...input, username: e.target.value })}
                        placeholder="Enter your username"
                    />
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
                        "Sign Up"
                    )}
                </Button>

                <span className="text-center">Already have an account? <Link className="text-blue-500" to="/login" >Login</Link></span>
            </form>
        </div>
    );
};

export default Signup;
