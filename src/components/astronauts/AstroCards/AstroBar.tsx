import "./AstroCardsStyle.css";
import CreateAstroCard from "./CreateAstroCard";
import AstronautCard from "./AstronautCard";
import { useState } from "react";
import PersonModal from "../../AstronautsForm/personformmodal";
import { useCosmonauts, useDeleteCosmonaut } from "../../../hooks/Cosmonautshooks/cosmonauts_hooks";

function AstroBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCosmation, setActiveCosmation] = useState<any>(null);

  // загрузка космонавтов с API
  const { data: astronauts = [], isLoading, error } = useCosmonauts();

  // удаление
  const deleteMutation = useDeleteCosmonaut();
  const handleDelete = (id: number) => {
    if (window.confirm("Видалити космонавта?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка при завантаженні</p>;

  return (
    <div className="astro-card-container">
      <CreateAstroCard
        onClick={() => {
          setModalOpen(true);
          setActiveCosmation(null);
        }}
      />

{astronauts.map((astro: any) => (
  <AstronautCard
    key={astro.id}
    photo={astro.photo}   // ✅ тянем фото из API
    onDelete={() => handleDelete(astro.id)}
    onEdit={() => {
      setActiveCosmation(astro);
      setModalOpen(true);
    }}
  >
    {astro.name}
  </AstronautCard>
))}

      {modalOpen && (
        <PersonModal
          existingPerson={activeCosmation}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AstroBar;