import React from "react";
import "./MaterialCardStyle.css";
import { useDeleteUserMaterial } from "../../hooks/Materialhooks/material_hooks";

type MaterialCardProps = {
  material: any;
  children: React.ReactNode;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ material, children }) => {
  const deleteMutation = useDeleteUserMaterial();

  const handleDelete = () => {
    if (window.confirm("Видалити цей ресурс?")) {
      deleteMutation.mutate(material.id);
    }
  };

  return (
    <div className="material-card">
      <div className="material-icon">
        {material.icon ? (
          <img src={material.icon} alt={material.name} />
        ) : (
          <span className="icon-placeholder">⚙️</span>
        )}
      </div>

      <div className="material-info">
        <h3>{children}</h3>
        <p>{material.type || "Тип не вказано"}</p>
      </div>

      <div className="material-actions">
        <button className="material-btn edit"></button>
        <button className="material-btn delete" onClick={handleDelete}></button>
      </div>
    </div>
  );
};

export default MaterialCard;
