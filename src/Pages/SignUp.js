import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../DataBase/supabaseClient";
import "./login.css"; // Reuse login layout styles
import "./signup.css";
import img from "../Data/bag-removebg-preview.png";
import img2 from "../Data/IPM_login_background.7db876e5.svg";

export default function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Scouter");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Sign up with Supabase Auth + Metadata
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role
                    }
                }
            });

            if (authError) throw authError;

            if (data.user) {
                alert("Account created successfully! If you can't log in, please check your email for a confirmation link (if enabled in your Supabase settings).");
                navigate("/");
            }
        } catch (err) {
            setError(err.message || "An error occurred during sign up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page signup-page">
            <div className="green-bg">
                <img src={img2} alt="background" />
            </div>

            <div className="login-box signup-box">
                <div className="img-class">
                    <img src={img} alt="IPM Scoutek" />
                </div>

                <form onSubmit={handleSignUp}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Role</label>
                    <select
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            border: "1px solid #ccc"
                        }}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Scouter">Scouter</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>

                    {error && <p className="error">{error}</p>}

                    <button className="enter-btn-2" type="submit" disabled={loading}>
                        {loading ? "CREATING..." : "SIGN UP"}
                    </button>
                </form>

                <p className="login-link" onClick={() => navigate("/")}>
                    Already have an account? <span>Login</span>
                </p>
            </div>
        </div>
    );
}
