import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../../../components/project/Navbar/Navbar";
import Catalog from "../../../components/project/Catalog/Catalog";
import Grid from "../../../components/project/Grid/Grid";
import "../../../components/project/ProjectPage.css";

import { useModules, useUpdateModule } from "../../../hooks/Moduleshooks/modules_hooks";
import { useProject } from "../../../hooks/Projectshooks/project_hooks";
import { useExternalSystems, useUpdateExternalSystem } from "../../../hooks/Externalsystemshooks/external_systems_hooks";

import { ProjectWrapper } from "../../../wrappers/project_form_wrapper";
import { useParams, useNavigate } from "react-router-dom";

const INITIAL_GRID = Array(12).fill(null);
const ROW_SIZE = 4;

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const id = projectId ? Number(projectId) : undefined;

  const { data: modulesData } = useModules(id as number);
  const { data: projectData } = useProject(id as number);
  const { data: exSystemsData } = useExternalSystems(String(id));

  const { mutate: updateModule } = useUpdateModule(id as number);
  const { mutate: updateExternalSystem } = useUpdateExternalSystem(String(id));

  const [views, setViews] = useState<Record<string, (string | null)[]>>({ root: [...INITIAL_GRID] });
  const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Модулі");
  const [viewStack] = useState<string[]>(["root"]);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [availableExSystems, setAvailableExSystems] = useState<string[]>([]);
  const [viewNames] = useState<Record<string, string>>({ root: "Spaceship Builder" });

  // Initialize grid & dimensions
  useEffect(() => {
    const dimensions: Record<string, { width: number; height: number }> = {};
    const newGrid: (string | null)[] = [...INITIAL_GRID];

    const processItem = (item: any) => {
      dimensions[item.name] = { width: item.w, height: item.h };
      // If server x=0, y=0 → catalog
      const inGrid = item.x && item.y ? true : false;
      if (!inGrid) return;
      const x0 = (item.x ?? 1) - 1; // 1-based → 0-based
      const y0 = (item.y ?? 1) - 1;
      for (let h = 0; h < item.h; h++) {
        for (let w = 0; w < item.w; w++) {
          const index = (y0 + h) * ROW_SIZE + (x0 + w);
          if (index < newGrid.length) newGrid[index] = item.name;
        }
      }
    };

    if (modulesData) {
      setAvailableModules(modulesData.filter(m => !m.x && !m.y).map(m => m.name));
      modulesData.forEach(processItem);
    }

    if (exSystemsData) {
      setAvailableExSystems(exSystemsData.filter(s => !s.x && !s.y).map(s => s.name));
      exSystemsData.forEach(processItem);
    }

    setItemDimensions(prev => ({ ...prev, ...dimensions }));
    setViews({ root: newGrid });
  }, [modulesData, exSystemsData]);

  const currentView = viewStack[viewStack.length - 1];
  const prevView = viewStack.length > 1 ? viewStack[viewStack.length - 2] : null;

  function pushChildView(index: number) {
    const itemName = views[currentView]?.[index];
    if (!itemName) return;
    const module = modulesData?.find(m => m.name === itemName);
    if (module) navigate(`/projects/${id}/modules/${module.id}`);
  }

  function goBack() {
    navigate("/");
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    const activeData = active?.data?.current ?? {};
    const label = activeData.label ?? active?.id;
    const srcView = activeData.viewId;
    const fromGrid = activeData.fromGrid;

    const overId: string | undefined = over?.id;
    const destMatch = overId ? overId.match(/^(.+)-square-(\d+)$/) : null;
    const destView = destMatch ? destMatch[1] : undefined;
    const destIndex = destMatch ? Number(destMatch[2]) : undefined;

    const { width = 1, height = 1 } = itemDimensions[label] || {};

    const movedModule = modulesData?.find(m => m.name === label);
    const movedExSystem = exSystemsData?.find(s => s.name === label);

    setViews(prev => {
      const copy = { ...prev };

      // Remove from source grid
      if (fromGrid && srcView) {
        const srcArr = [...(copy[srcView] ?? [])];
        for (let i = 0; i < srcArr.length; i++) {
          if (srcArr[i] === label) srcArr[i] = null;
        }
        copy[srcView] = srcArr;
      }

      // Dropped outside → catalog
      if (!destView || typeof destIndex !== "number") {
        if (fromGrid) {
          if (selectedFilter === "Модулі") setAvailableModules(prev => prev.includes(label) ? prev : [...prev, label]);
          else setAvailableExSystems(prev => prev.includes(label) ? prev : [...prev, label]);

          if (movedModule?.id) updateModule({ id: movedModule.id, data: { x: 0, y: 0 } });
          if (movedExSystem?.id) updateExternalSystem({ id: movedExSystem.id, data: { ...movedExSystem, x: 0, y: 0 } });
        }
        return copy;
      }

      // Dropped on grid → calculate position
      const colStart = destIndex % ROW_SIZE;
      const rowStart = Math.floor(destIndex / ROW_SIZE);
      const totalRows = Math.ceil((copy[destView]?.length ?? 12) / ROW_SIZE);

      // Check if it fits
      let fits = true;
      if (colStart + width > ROW_SIZE || rowStart + height > totalRows) fits = false;

      if (fits) {
        for (let h = 0; h < height; h++) {
          const rowOffset = (rowStart + h) * ROW_SIZE;
          for (let w = 0; w < width; w++) {
            if ((copy[destView]?.[rowOffset + colStart + w] ?? null) !== null) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
      }

      if (!fits) return prev;

      const destArr = [...(copy[destView] ?? Array(12).fill(null))];
      for (let h = 0; h < height; h++) {
        const rowOffset = (rowStart + h) * ROW_SIZE;
        for (let w = 0; w < width; w++) {
          destArr[rowOffset + colStart + w] = label;
        }
      }
      copy[destView] = destArr;

      // Remove from catalog if dragged from there
      if (!fromGrid) {
        if (selectedFilter === "Модулі") setAvailableModules(prev => prev.filter(i => i !== label));
        else setAvailableExSystems(prev => prev.filter(i => i !== label));
      }

      // Save to backend (1-based)
      if (movedModule?.id) updateModule({ id: movedModule.id, data: { x: colStart + 1, y: rowStart + 1 } });
      if (movedExSystem?.id) updateExternalSystem({ id: movedExSystem.id, data: { ...movedExSystem, x: colStart + 1, y: rowStart + 1 } });

      return copy;
    });
  }

  return (
    <div className="project__content_container">
      {settingsOpen && id && <ProjectWrapper projectId={String(id)} onClose={() => setSettingsOpen(false)} />}
      <Navbar
        topName={projectData?.name}
        prevName={prevView ? viewNames[prevView] : undefined}
        onBackClick={goBack} onOpenResources={() => setIsModalOpen(true)}
      />
      {isModalOpen && <MaterialModal onClose={() => setIsModalOpen(false)} />}
      <div className="project__content_main">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={rectIntersection}>
          <Catalog
            items={selectedFilter === "Модулі" ? availableModules : availableExSystems}
            firstButton="Модулі"
            secondButton="Зовнішні системи"
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
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
                    itemDimensions={itemDimensions}
                    onSquareDoubleClick={pushChildView}
                    rowSize={ROW_SIZE}
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