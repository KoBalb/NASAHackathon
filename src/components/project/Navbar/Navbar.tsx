import "./Navbar.css"
import settingsIcon from "../../../assets/icons/settings_icon.svg";

type NavProps = {
  topName?: string;
  prevName?: string;
  onBackClick?: () => void;
  onOpenResources?: () => void; // 👈 добавили
  onSettingsClick?: () => void;  // 👈 new
};

export default function Navbar({ topName, prevName, onBackClick, onSettingsClick, onOpenResources }: NavProps) {

  return (
    <nav className="project__navbar_container">
      <button className="navbar__start_btn" onClick={onBackClick}>
        {prevName ? `🔙 ${prevName}` : "На головну"}
      </button>

      <p className="navbar__project_text">{topName}</p>

      <div className="navbar__right_container">
        <button className="navbar__right_btn" onClick={onOpenResources}>
          <p className="navbar__right_text">Ресурси</p>
        </button>
        <button className="navbar__right_btn">
          <p className="navbar__right_text">Створити місію</p>
        </button>
        <button className="navbar__right_settings_btn" onClick={onSettingsClick}>
          <img
            className="navbar__right_settings_icon"
            src={settingsIcon}
            alt="settings icon"
          />
        </button>
      </div>

    </nav>
  );
}
