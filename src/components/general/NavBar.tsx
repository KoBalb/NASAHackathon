import "./NavBarStyle.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NavigationBar() {

  const navigate = useNavigate();

  return (
    <div className="header">
      <h1 className="logo">SpaceHomeEditor</h1>
      <nav className="nav">
        <NavLink to="/">
          Головна
        </NavLink>
        <NavLink to="/projects">
          Мої проекти
        </NavLink>
        <NavLink to="/catalogs">
          Каталог
        </NavLink>
        <NavLink to="/astronauts">
          Космонавти
        </NavLink>
        <button onClick={() => navigate("/login")} className="login-btn">Вхід</button>
      </nav>
    </div>
  );
}

export default NavigationBar;
