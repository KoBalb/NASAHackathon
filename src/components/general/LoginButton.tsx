import "./LogButtonStyle.css";
import { NavLink } from "react-router-dom";
import { Auth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function LoginButton() {
  const { token, logout } = Auth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="login-btn">
      {token ? (
        <button onClick={handleLogout}>
          Вихід
        </button>
      ) : (

        <NavLink to="/login">
          Вхід
        </NavLink>
      )}
    </div>
  );
}

export default LoginButton;
