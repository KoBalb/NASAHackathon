import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../AuthContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
      navigate("/home");
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="username" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
