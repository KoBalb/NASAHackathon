import "./AstroCardsStyle.css";
import CreateAstroCard from "./CreateAstroCard";
import AstronautCard from "./AstronautCard";
import { useState } from "react";
import PersonModal from "../../AstronautsForm/personformmodal";

function AstroBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCosmation, setActiveCosmation] = useState(null);
  return (
    <div className="astro-card-container">
      <CreateAstroCard
        onClick={() => {
          setModalOpen(true);
        }}
      />

      <AstronautCard>піб 1</AstronautCard>
      <AstronautCard>Артем</AstronautCard>
      <AstronautCard>Мамут</AstronautCard>
      {modalOpen && (
        <PersonModal
          existingPerson={activeCosmation}
          closeModal={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default AstroBar;
