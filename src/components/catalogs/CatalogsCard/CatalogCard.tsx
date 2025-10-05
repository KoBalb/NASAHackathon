import "./CatalogCardsStyles.css";
import projectIcon from "../../images/project_icon.png";
import wrenchIcon from "../../images/wrench.png";
import deleteIcon from "../../images/deleteProject.png";

type CardProps = {
  teg: string;
  children: React.ReactNode;
};

function CatalogCard({ teg, children }: CardProps) {
  
  return (
      <div className="catalog-card">
            <div
              className="catalog-card-image"
              style={{ cursor: "pointer" }}
            >
              <img src={projectIcon} alt="preview"/>
            </div>

            <div className="card-footer">
              <div className="card-info">
                <h3>{children}</h3>
                <p>{teg}</p>
              </div>
              <div className="card-actions">
                <button className="catalog-action-btn" style={{ backgroundImage: `url(${wrenchIcon})` }}></button>
                <button className="catalog-action-btn delete" style={{ backgroundImage: `url(${deleteIcon})` }}></button>
              </div>
            </div>
      </div>
    )
}

export default CatalogCard;