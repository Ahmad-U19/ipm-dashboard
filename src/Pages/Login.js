import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import img from "../Data/bag-removebg-preview.png";
import img2 from "../Data/IPM_login_background.7db876e5.svg"

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

  const users = [
    { email: "test@test.com", password: "123456" },
    { email: "admin@ipm.com", password: "admin123" },
  ];

  const t = texts[lang];

  const handleSubmit = (e) => {
    e.preventDefault();

    const match = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      setError(t.invalid);
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="green-bg">
        <img src={img2} alt="non-ipm"/>
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
          />

          <label>{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">{t.enter}</button>
        </form>

        <p className="forgot">{t.forgot}</p>

        <div className="language">
            <label >Language: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
}
