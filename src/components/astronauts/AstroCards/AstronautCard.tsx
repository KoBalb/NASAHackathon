import "./AstroCardsStyle.css";
import astroIcon from "../../images/iconAstronaut.png";
import wrenchIcon from "../../images/wrench.png";
import deleteIcon from "../../images/deleteProject.png";

type CardProps = {
  children: React.ReactNode;
};

function AstronautCard({ children }: CardProps) {
  
  return (
    <div className="astro-card">
      <div className="astro-card-info">
        <h3>{children}</h3>
      </div>

      <div className="astro-card-footer">
        <div className="astro-card-image" style={{ cursor: "pointer" }}>
          <img src={astroIcon} alt="preview"/>
        </div>

        <div className="astro-btn-container">
          <button className="astro-action-btn" style={{ backgroundImage: `url(${wrenchIcon})` }}></button>
          <button className="astro-action-btn delete" style={{ backgroundImage: `url(${deleteIcon})` }}></button>
        </div>

      </div>
    </div>
  )
}

export default AstronautCard;