import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Auth } from "../../AuthContext";
import { useEffect } from "react";

import "./RegistrationStyle.css";
import starsIcon from "../../components/images/starsIcon.png";
import iconNOVA from "../../components/images/iconNOVA.png";

type RegistrationForm = {
  username: string;
  password: string;
};

export default function Registration() {
  const { register ,  handleSubmit } = useForm<RegistrationForm>();
  const { login } = Auth(); 
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      console.log(data)
      const res = await api.post("/user/register/", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        login(data.token); 
        navigate("/");
      } else {
        alert("Регистрация успешна! Теперь войдите в систему.");
        navigate("/login");
      }
    },
    onError: (error: any) => {
      console.error(error);
      alert("Ошибка при регистрации!");
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    mutation.mutate(data);
  };
    const token = localStorage.getItem("token"); 
    useEffect(() => {
      if (token) {
        navigate("/"); 
      }
    }, [token, navigate]);

  return (
    <div className="registration-page">
      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="title-container">
          <img src={iconNOVA} alt="NOVA icon" className="nova-icon-img"/>
          <h1>Реєстрація</h1>
          <img src={starsIcon} alt="stars icon" className="stars-img"/>
        </div>
        <h2>Логін</h2>
        <input
          {...register("username", { required: true })}
          type="text"
        />
        <h2>Пароль</h2>
        <input
          {...register("password", { required: true })}
          type="password"
        />
        <h2>Підтвердити пароль</h2>
        <input
          {...register("password", { required: true })}
          type="password"
        />
        <div className="button-container">
          <button className="button-cancel">
            Відмінити
          </button>
          <button type="submit" className="button-registration">
            Створити акаунт
          </button>
        </div>
      </form>
    </div>
  );
}