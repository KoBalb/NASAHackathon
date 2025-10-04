import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./ProjecrCardsStyles.css";
import projectIcon from "../../images/project_icon.png";
import CreateProjectModal from "../../modalform/modal";
import { deleteProject } from "../../../api/projectsApi/projects_api";
import { useNavigate } from "react-router-dom";

type CardProps = {
  date: string;
  children: React.ReactNode;
  project?: any; // объект проекта
};

function ProjectCard({ date, children, project }: CardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  
  const queryClient = useQueryClient();

  const goToProject = () => {
    if (project?.id) {
      navigate(`/projects/${project.id}`);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!project) return;
      await deleteProject(project.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      console.error("Ошибка при удалении проекта:", error);
    },
  });
  

  return (
    <>
      <div className="prjct-card">
        <div
          className="card-image"
          onClick={goToProject}
          style={{ cursor: "pointer" }}
        >
          <img
            src={
              project?.preview
                ? `${project.preview}?t=${project.updated_at || new Date().getTime()}`
                : projectIcon
            }
            alt="preview"
          />
        </div>

        <div className="card-footer">
          <div className="card-info">
            <h3>{children}</h3>
            <p>Дата: {date}</p>
          </div>
          <div className="card-actions">
            <button className="action-btn" onClick={() => setModalOpen(true)}>
              ✎
            </button>
            <button
              className="action-btn delete"
              onClick={() => {
                if (window.confirm("Вы уверены, что хотите удалить проект?")) {
                  deleteMutation.mutate();
                }
              }}
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CreateProjectModal existingProject={project} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export default ProjectCard;