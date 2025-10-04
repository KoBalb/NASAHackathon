import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../../components/project/Navbar/Navbar";
import Catalog from "../../../components/project/Catalog/Catalog";
import Grid from "../../../components/project/Grid/Grid";
import "../../../components/project/ProjectPage.css";

const INITIAL_GRID = Array(12).fill(null);

export default function Project() {
  const [views, setViews] = useState<Record<string, (string | null)[]>>({
    root: [...INITIAL_GRID],
  });

  const [viewStack, setViewStack] = useState<string[]>(["root"]);

  const [catalogItems, setCatalogItems] = useState<string[]>([
    "Engine",
    "Solar Panel",
    "Antenna",
    "Sensor",
    "Battery",
    "Camera",
    "Thruster",
  ]);

  const [viewNames, setViewNames] = useState<Record<string, string>>({
    root: "Spaceship Builder",
  });

  const currentView = viewStack[viewStack.length - 1];

  function pushChildView(index: number) {
    const childId = `${currentView}-child-${index}`;
    const itemName = views[currentView]?.[index] ?? "Unnamed Module";

    setViews(prev => (prev[childId] ? prev : { ...prev, [childId]: [...INITIAL_GRID] }));

    setViewNames(prev => (prev[childId] ? prev : { ...prev, [childId]: itemName }));

    setViewStack(prev => [...prev, childId]);
  }


  function goBack() {
    if (viewStack.length > 1) setViewStack(prev => prev.slice(0, -1));
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    const activeData = active?.data?.current ?? {};
    const label = activeData.label ?? active?.id;
    const srcView = activeData.viewId;
    const srcIndex = activeData.index;

    const overId: string | undefined = over?.id;
    const destMatch = overId ? overId.match(/^(.+)-square-(\d+)$/) : null;
    const destView = destMatch ? destMatch[1] : undefined;
    const destIndex = destMatch ? Number(destMatch[2]) : undefined;

    setViews(prev => {
      const copy: Record<string, (string | null)[]> = { ...prev };

      if (activeData.fromGrid && srcView && typeof srcIndex === "number") {
        const arr = [...(copy[srcView] ?? [])];
        arr[srcIndex] = null;
        copy[srcView] = arr;
      }

      if (destView && typeof destIndex === "number") {
        const destArr = [...(copy[destView] ?? [...INITIAL_GRID])];
        if (!destArr[destIndex]) {
          destArr[destIndex] = label;
          copy[destView] = destArr;
        } else {
          const insertAt = activeData.catalogIndex ?? prev.length;
          setCatalogItems(prev => {
            const newArr = [...prev];
            newArr.splice(insertAt, 0, label);
            return newArr;
          });
        }
      }

      return copy;
    });

    if (!activeData.fromGrid && destView && typeof destIndex === "number") {
      setCatalogItems(prev => prev.filter(i => i !== label));
    }

    if (!over && activeData.fromGrid) {
      setCatalogItems(prev => [...prev, label]);
    }
  }

  return (
    <div className="project__content_container">
      <Navbar topName={viewNames[currentView]} />
      <div className="project__content_main">
        <DndContext onDragEnd={handleDragEnd}>
          <Catalog
            items={catalogItems}
            onItemRemove={id => setCatalogItems(prev => prev.filter(i => i !== id))}
          />

          <div className="main__content">
            <div className="zoom-toolbar">
              {viewStack.length > 1 && <button className="project__back_btn" onClick={goBack}>🔙 Back</button>}
            </div>

            <div className="zoom-wrapper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Grid
                    viewId={currentView}
                    items={views[currentView]}
                    onSquareDoubleClick={pushChildView}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}