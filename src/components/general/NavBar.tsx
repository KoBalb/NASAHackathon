import "./NavBarStyle.css";
import LoginButton from "./LoginButton";
import { NavLink } from "react-router-dom";

function NavigationBar() {


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
        <LoginButton />
      </nav>
    </div>
  );
}

export default NavigationBar;
