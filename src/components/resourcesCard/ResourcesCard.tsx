import React, { useState } from "react";

interface Resource {
  id: number;
  resourceId: number | null;
  value: number;
  unit: string;
}

interface ResourceManagerProps {
  onCreate?: (resource: Resource) => void;
  onDelete?: (id: number) => void;
  onEdit?: (resource: Resource) => void;
}

const resourceOptions = [
  { id: 1, name: "Кисень" },
  { id: 2, name: "Вода" },
  { id: 3, name: "Їжа" },
];

const ResourceManager: React.FC<ResourceManagerProps> = ({
  onCreate,
  onDelete,
  onEdit,
}) => {
  const [resources, setResources] = useState<Resource[]>([]);

  const addResource = () => {
    const newRes: Resource = {
      id: Date.now(),
      resourceId: null,
      value: 0,
      unit: "",
    };
    setResources((prev) => [...prev, newRes]);
    onCreate?.(newRes);
  };

  const updateResource = (
    id: number,
    field: keyof Resource,
    value: string | number | null
  ) => {
    setResources((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, [field]: value } : res
      )
    );

    const updated = resources.find((r) => r.id === id);
    if (updated) {
      const edited: Resource = { ...updated, [field]: value };
      onEdit?.(edited);
    }
  };

  const removeResource = (id: number) => {
    setResources((prev) => prev.filter((res) => res.id !== id));
    onDelete?.(id);
  };

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h3>Керування ресурсами</h3>
        <button onClick={addResource} className="add-btn">
          +
        </button>
      </div>

      {resources.map((res) => (
        <div key={res.id} className="resource-row">
          <select
            value={res.resourceId ?? ""}
            onChange={(e) =>
              updateResource(res.id, "resourceId", Number(e.target.value))
            }
          >
            <option value="">Оберіть ресурс</option>
            {resourceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="значення (- або +)"
            value={res.value}
            onChange={(e) => updateResource(res.id, "value", +e.target.value)}
          />

          <input
            type="text"
            placeholder="одиниця виміру"
            value={res.unit}
            onChange={(e) => updateResource(res.id, "unit", e.target.value)}
          />

          <button
            className="delete-btn"
            onClick={() => removeResource(res.id)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResourceManager;