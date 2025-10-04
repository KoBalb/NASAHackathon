import "./NavBarStyle.css";
import LoginButton from "./LoginButton";
import { NavLink } from "react-router-dom";
import logo from "../images/iconNOVA.png";

function NavigationBar() {


  return (
    <div className="header">
      <NavLink to="/" className="logo-container">
        <img src={logo} alt="NOVA logo"/>
      
        <h1 className="logo">SpaceHomeEditor</h1>
      </NavLink>
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
