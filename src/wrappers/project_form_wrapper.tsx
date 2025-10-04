import React from "react";
import { useProject } from "../hooks/Projectshooks/project_hooks";
import CreateProjectModal from "../components/modalform/modal";



interface ProjectWrapperProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectWrapper: React.FC<ProjectWrapperProps> = ({ projectId, onClose }) => {
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) return null;
  if (error) return  null;

  return (
    <CreateProjectModal
      existingProject={project}
      onClose={onClose}
    />
  );
};