import "./LogButtonStyle.css";
import { NavLink } from "react-router-dom";
import { Auth } from "../../AuthContext"; 

function LoginButton() {
  const { token, logout } = Auth();

  return (
    <div className="login-btn">
      {token ? (
        <button onClick={logout}>
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
