import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../DataBase/supabaseClient"; // ⬅️ important!
import "./login.css";
import img from "../Data/bag-removebg-preview.png";
import img2 from "../Data/IPM_login_background.7db876e5.svg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");

  const texts = {
    en: {
      email: "Email Address",
      password: "Password",
      enter: "ENTER",
      forgot: "Forgot Your Password?",
      invalid: "Invalid email or password",
    },
    es: {
      email: "Correo electrónico",
      password: "Contraseña",
      enter: "ENTRAR",
      forgot: "¿Olvidaste tu contraseña?",
      invalid: "Correo o contraseña inválidos",
    },
  };

  const t = texts[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Authenticate with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t.invalid); // show translated error
      return;
    }

    setError("");

    // OPTIONAL: fetch profile data here if needed
    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("*")
    //   .eq("user_id", data.user.id)
    //   .single();

    navigate("/dashboard"); // redirect after login
  };

  return (
    <div className="login-page">
      <div className="green-bg">
        <img src={img2} alt="non-ipm" />
      </div>

      <div className="login-box">
        <div className="img-class">
          <img src={img} alt="IPM Scoutek" />
        </div>

        <form onSubmit={handleSubmit}>
          <label>{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button className="enter-btn" type="submit">{t.enter}</button>
        </form>

        <p className="forgot">{t.forgot}</p>

        <div className="language">
          <label>Language: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
}
