import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import Navbar from "../../../components/project/Navbar/Navbar";
import Catalog from "../../../components/project/Catalog/Catalog";
import Grid from "../../../components/project/Grid/Grid.tsx";
import "../../../components/project/ProjectPage.css";

function Project() {
  const [gridItems, setGridItems] = useState<(string | null)[]>(Array(12).fill(null));
  const [catalogItems, setCatalogItems] = useState<string[]>([
    "Engine",
    "Solar Panel",
    "Antenna",
    "Sensor",
    "Battery",
    "Camera",
    "Thruster",
  ]);

  function handleDragEnd(event: any) {
    const { over, active } = event;
    const newGrid = [...gridItems];

    if (active.data.current?.fromGrid) {
      const oldIndex = active.data.current.index as number;
      newGrid[oldIndex] = null;
    }

    if (over && over.id.startsWith("square-")) {
      const index = parseInt(over.id.replace("square-", ""));

      if (active.data.current?.fromGrid && active.data.current.index === index) {
        return;
      }

      if (!newGrid[index]) {
        newGrid[index] = active.id;
        setGridItems(newGrid);

        if (!active.data.current?.fromGrid) {
          setCatalogItems(prev => prev.filter(item => item !== active.id));
        }
        return;
      }
    }
    else if (active.data.current?.fromGrid) {
      setGridItems(newGrid);
      setCatalogItems(prev => [...prev, active.id]);
    }
  }

  return (
    <div className="project__content_container">
      <Navbar topName="Назва проекту" />
      <div className="project__content_main">
        <DndContext onDragEnd={handleDragEnd}>
          <Catalog
            items={catalogItems}
            onItemRemove={id => setCatalogItems(prev => prev.filter(item => item !== id))}
          />
          <div className="main__content">
            <Grid items={gridItems} />
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default Project;