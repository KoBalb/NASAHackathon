import React from "react";
import CreateProjectCard from "./CreateProjectCard";
import ProjectCard from "./ProjectCard";
import "./ProjecrCardsStyles.css";
import { useProjects } from "../../../hooks/Projectshooks/project_hooks";

function ProjectsBar() {
  // пример данных проектов
  const { data: projects, error } = useProjects();
  console.log("Projects data:", error);
    if (!projects) return <div>Loading...</div>;
    if (error) return <div>Error loading projects</div>;
  
  return (
    <div className="card-container">
      <CreateProjectCard />

        {projects.map((p) => (
        <ProjectCard key={p.id} date={p.created_at} project={p}>
          {p.name}
        </ProjectCard>
      ))}
    </div>
  );
}

export default ProjectsBar;