import { useState } from "react";
import { useProjects } from "../../hooks/Projectshooks/project_hooks";
import CreateProjectModal from "./modal";


function Catalogs() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const openCreateModal = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <div>
      <h2>Список проектов</h2>
      <button onClick={openCreateModal}>Создать новый проект</button>

      {projects?.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <img src={p.preview} alt={p.name} width={150} />
          <pre>{JSON.stringify(p, null, 2)}</pre>
          <button onClick={() => openEditModal(p)}>Редактировать</button>
        </div>
      ))}

      {modalOpen && (
        <CreateProjectModal
          existingProject={editingProject} // ⚠ важно: existingProject, а не project
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Catalogs;