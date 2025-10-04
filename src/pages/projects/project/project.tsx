import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../../components/project/Navbar/Navbar";
import Catalog from "../../../components/project/Catalog/Catalog";
import Grid from "../../../components/project/Grid/Grid";
import "../../../components/project/ProjectPage.css";

import { useModules } from "../../../hooks/Moduleshooks/modules_hooks";
import { useProject } from "../../../hooks/Projectshooks/project_hooks";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

const INITIAL_GRID = Array(12).fill(null);

export default function Project() {

  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();

  const id = projectId ? Number(projectId) : undefined;

  const { data: modulesData } = useModules(id as number)
  const { data: projectData } = useProject(id as number)

  const [views, setViews] = useState<Record<string, (string | null)[]>>({
    root: [...INITIAL_GRID],
  });

  const [viewStack] = useState<string[]>(["root"]);

  const [catalogItems, setCatalogItems] = useState<string[]>([]);

  useEffect(() => {
    if (modulesData) {
      setCatalogItems(modulesData.map(module => module.name));
      console.log(modulesData)
    }
  }, [modulesData]);

  useEffect(() => {
    if (projectData) {
      console.log(projectData)
    }
  }, [projectData]);

  const [viewNames] = useState<Record<string, string>>({
    root: "Spaceship Builder",
  });

  const currentView = viewStack[viewStack.length - 1];
  const prevView = viewStack.length > 1 ? viewStack[viewStack.length - 2] : null;

  function pushChildView(index: number) {
    const itemName = views[currentView]?.[index];

    if (!itemName) return;

    const module = modulesData?.find(m => m.name === itemName);

    if (module) {
      navigate(`/projects/${id}/modules/${module.id}`);
    }
  }

  function goBack() {
    navigate("/")
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
      <Navbar
        topName={projectData?.name}
        prevName={prevView ? viewNames[prevView] : undefined}
        onBackClick={goBack}
      />
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