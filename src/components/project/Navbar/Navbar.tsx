import "./Navbar.css"

import settingsIcon from "../../../assets/icons/settings_icon.svg"

type NavProps = {
  topName: string
}

export default function Navbar({ topName }: NavProps) {

  return (
    <>
      <nav className="project__navbar_container">
        <button className="navbar__start_btn">На початок</button>
        <p className="navbar__project_text">{topName}</p>
        <div className="navbar__right_container">
          <button className="navbar__right_btn">
            <p className="navbar__right_text">Ресурси</p>
          </button>
          <button className="navbar__right_btn">
            <p className="navbar__right_text">Створити місію</p>
          </button>
          <button className="navbar__right_settings_btn">
            <img className="navbar__right_settings_icon" src={settingsIcon} alt="settings icon" />
          </button>
        </div>
      </nav>
    </>
  )
}