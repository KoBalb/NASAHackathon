import CreateProjectCard from "./CreateProjectCard";
import "./ProjecrCardsStyles.css";
import ProjectCard from "./ProjectCard";

function ProjectsBar() {
    return (
        <div className="card-container">
            <CreateProjectCard />
            <ProjectCard date="24.09.2025">My Project</ProjectCard>
            <ProjectCard date="15.09.2025">Star 1</ProjectCard>
            <ProjectCard date="01.10.2025">Корабель</ProjectCard>
            <ProjectCard date="03.10.2025">Новий проєкт</ProjectCard>
        </div>
    )
}

export default ProjectsBar;

