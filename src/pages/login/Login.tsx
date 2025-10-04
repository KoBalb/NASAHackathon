import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../AuthContext";
import api from "../../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import "./LoginStyle.css";
import starsIcon from "../../components/images/starsIcon.png";
import iconNOVA from "../../components/images/iconNOVA.png";

type LoginForm = { username: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = Auth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await api.post("/user/login/", data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.token);
      navigate("/");
    },
    onError: () => {
      alert("Invalid email or password");
    },
  });

  const token = localStorage.getItem("token"); 
  useEffect(() => {
    if (token) {
      navigate("/"); 
    }
  }, [token, navigate]);

  const onSubmit = (data: LoginForm) => mutation.mutate(data);

  return (
      <div className="login-page">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

          <div className="title-container">
            <img src={iconNOVA} alt="NOVA icon" className="nova-icon-img"/>
            <h1>Вхід</h1>
            <img src={starsIcon} alt="stars icon" className="stars-img"/>
          </div>

          <h2>Логін</h2>
          <input {...register("username")}/>

          <h2>Пароль</h2>
          <input {...register("password")} type="password" />

          <div className="button-container">
            <NavLink to="/register" className="button-registr">
              Реєстрація
            </NavLink>
            <button type="submit" className="button-login">
              Увійти
            </button>
          </div>
    
        </form>
    </div>
  );
}