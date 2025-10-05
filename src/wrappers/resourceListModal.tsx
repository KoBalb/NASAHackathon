import React from "react";
import "./MaterialModalStyle.css";
import { useUserMaterials } from "../hooks/Materialhooks/material_hooks";
import MaterialCard from "../components/MaterialsCards/MaterialCard";


interface MaterialModalProps {
  onClose: () => void;
}

const MaterialModal: React.FC<MaterialModalProps> = ({ onClose }) => {
  const { data: materials, isLoading, error } = useUserMaterials();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  

  return (
    <div className="material-modal-overlay" onClick={onClose}>
      <div className="material-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ресурси</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="material-card-container">
          {materials?.map((m) => (
            <MaterialCard key={m.id} material={m}>
              {m.name}
            </MaterialCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;

