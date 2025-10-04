import React, { useState } from "react";
import "./ProjecrCardsStyles.css";
import PlusSign from "../../images/plus-sign.png";
import CreateProjectModal from "../../modalform/modal";


function CreateProjectCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button className="prjct-card create" onClick={() => setModalOpen(true)}>
        <img className="plus-sign" src={PlusSign} alt="plus sign" />
        <h2>створити</h2>
      </button>

      {modalOpen && <CreateProjectModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default CreateProjectCard;