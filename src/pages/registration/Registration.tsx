import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Auth } from "../../AuthContext";
import { useEffect } from "react";
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("username", { required: true })}
        type="text"
        placeholder="username"
      />
      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
      />
      <button type="submit">
        Зарегистрироваться
      </button>
    </form>
  );
}