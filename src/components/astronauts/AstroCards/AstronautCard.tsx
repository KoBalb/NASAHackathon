import "./AstroCardsStyle.css";
import wrenchIcon from "../../images/wrench.png";
import deleteIcon from "../../images/deleteProject.png";

type CardProps = {
  children: React.ReactNode;
  photo?: string | null;
  onDelete: () => void;
  onEdit?: () => void;
};

function AstronautCard({ children, photo, onDelete, onEdit }: CardProps) {
  return (
    <div className="astro-card">
      <div className="astro-card-info">
        <h3>{children}</h3>
      </div>

      <div className="astro-card-footer">
        <div className="astro-card-image" style={{ cursor: "pointer" }}>
          <img 
            src={photo || "/src/assets/placeholder.png"} 
            alt="preview"
          />
        </div>

        <div className="astro-btn-container">
          <button
            className="astro-action-btn"
            style={{ backgroundImage: `url(${wrenchIcon})` }}
            onClick={onEdit}
          />
          <button
            className="astro-action-btn delete"
            style={{ backgroundImage: `url(${deleteIcon})` }}
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default AstronautCard;