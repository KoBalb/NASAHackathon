import CreateCatalogCard from "./CreateCatalogCard";
import CatalogCard from "./CatalogCard";
import "./CatalogCardsStyles.css";
import { useState } from "react";
import type { Catalog } from "../../../types";
import { useCatalogsQuery } from "../../../hooks/Catalogshooks/catalogs_hooks";
import CreateCatalogModal from "../../Catalogform/modal";

function CatalogBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);

  const { data: сatalogs, isLoading, error } = useCatalogsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const openCreateModal = () => {
    setEditingCatalog(null);
    setModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingCatalog(project);
    setModalOpen(true);
  };
  return (
    <div className="card-container">
      <CreateCatalogCard />
      {(сatalogs ?? []).map((c) => (
        <CatalogCard key={c.id} teg="#">
          {c.name}
        </CatalogCard>
      ))}
      {modalOpen && (
        <CreateCatalogModal
          existingCatalog={editingCatalog} // ⚠ важно: existingProject, а не project
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default CatalogBar;
