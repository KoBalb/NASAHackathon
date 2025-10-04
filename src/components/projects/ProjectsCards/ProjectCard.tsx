import "./ProjecrCardsStyles.css";
import projectIcon from "../../images/project_icon.png";

type CardProps = {
  date: string;
  children: React.ReactNode;
};


function ProjectCard({date, children}: CardProps) {
  return (
    <div className="prjct-card">
      <div className="card-image">
        <img
          src={projectIcon}
          alt="preview"
        />
      </div>

      <div className="card-footer">
        <div className="card-info">
          <h3>{children}</h3>
          <p>Дата: {date}</p>
        </div>
        <div className="card-actions">
          <button className="action-btn"></button>
          <button className="action-btn delete"></button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;