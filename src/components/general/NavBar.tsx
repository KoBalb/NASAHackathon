import "./NavBarStyle.css";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  return (
    <div className="header">
      <div>
        <h1 className="logo">SpaceHomeEditor</h1>
      </div>
      <div>
        <nav className="nav">
          <NavLink to="/">
            Головна
          </NavLink>

          <NavLink to="/projects">
            Мої проекти
          </NavLink>

          <NavLink to="/catalog">
            Каталог
          </NavLink>

          <NavLink to="/astronauts">
            Космонавти
          </NavLink>
          <button className="login-btn">Вхід</button>
        </nav>
      </div>
    </div>
  );
}

export default NavigationBar;
