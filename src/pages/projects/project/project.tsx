import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../components/project/Navbar/Navbar";
import Catalog from "../../../components/project/Catalog/Catalog";
import Grid from "../../../components/project/Grid/Grid";
import "../../../components/project/ProjectPage.css";

import {
  useModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule
} from "../../../hooks/Moduleshooks/modules_hooks";
import { useProject } from "../../../hooks/Projectshooks/project_hooks";
import { useCatalogsQuery } from "../../../hooks/Catalogshooks/catalogs_hooks";

import { useParams, useNavigate } from "react-router-dom";
import MaterialModal from "../../../wrappers/resourceListModal";
import { ProjectWrapper } from "../../../wrappers/project_form_wrapper";

const ROW_SIZE = 4;
const INITIAL_GRID = Array(12).fill(null);

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [views, setViews] = useState<Record<string, (any | null)[]>>({ root: [...INITIAL_GRID] });
  const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Модулі");
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [viewStack] = useState<string[]>(["root"]);
  const [viewNames] = useState<Record<string, string>>({ root: "Spaceship Builder" });

  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const id = projectId ? Number(projectId) : undefined;

  const { data: modulesData } = useModules(id as number);
  const { data: projectData } = useProject(id as number);
  const { data: catalogsData } = useCatalogsQuery();

  const { mutate: updateModule } = useUpdateModule(id as number);
  const { mutate: createModule } = useCreateModule(id as number);
  const { mutate: deleteModule } = useDeleteModule(id as number);

  // Создаем мапу catalogId -> photo
  const catalogPhotoMap = catalogsData?.reduce<Record<number, string>>((acc, c) => {
    if (c.type === "MO") acc[c.id] = c.photo ?? "";
    return acc;
  }, {}) ?? {};

  // Initialize grid and available modules
  useEffect(() => {
    const newGrid: (any | null)[] = [...INITIAL_GRID];
    const dimensions: Record<string, { width: number; height: number }> = {};

    modulesData?.forEach(item => {
      const dim = { width: item.w ?? 1, height: item.h ?? 1 };
      dimensions[item.name] = dim;

      const photo = catalogPhotoMap[item.catalog] ?? "";

      if (item.x != null && item.y != null) {
        const x0 = item.x - 1;
        const y0 = item.y - 1;
        for (let h = 0; h < dim.height; h++) {
          for (let w = 0; w < dim.width; w++) {
            const index = (y0 + h) * ROW_SIZE + (x0 + w);
            if (index < newGrid.length) {
              newGrid[index] = { ...item, serverId: item.id, photo };
            }
          }
        }
      }
    });

    setItemDimensions(dimensions);
    setViews({ root: newGrid });

    // Available modules with photos
    setAvailableModules(
      catalogsData
        ?.filter(c => c.type === "MO" && !modulesData?.some(m => m.catalog === c.id))
        .map(c => ({ ...c, photo: c.photo ?? "" })) ?? []
    );
  }, [modulesData, catalogsData]);

  const currentView = viewStack[viewStack.length - 1];
  const goBack = () => navigate("/");

  const pushChildView = (index: number) => {
    const item = views[currentView]?.[index];
    if (!item) return;
    const module = modulesData?.find(m => m.id === item.serverId);
    if (module) navigate(`/projects/${id}/modules/${module.id}`);
  };

  const addToAvailableModules = (item: any) => {
    setAvailableModules(prev => {
      const newArr = [...prev, item];
      return newArr.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
    });
  };

  const handleDragStart = () => {
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = (event: any) => {
    document.body.style.overflow = "";

    const { active, over } = event;
    if (!active) return;

    const item = active.data.current.item;
    if (!item) return;

    const match = over?.id?.match(/^(.+)-square-(\d+)$/);
    const destIndex = match ? Number(match[2]) : null;
    const col = destIndex !== null ? (destIndex % ROW_SIZE) + 1 : null;
    const row = destIndex !== null ? Math.floor(destIndex / ROW_SIZE) + 1 : null;

    const droppedOutsideGrid = !over || !over.id.startsWith(`${currentView}-square-`);

    // Dropped outside grid
    if (droppedOutsideGrid) {
      if (item.serverId) {
        deleteModule(item.serverId, {
          onSuccess: () => {
            setViews(prev => {
              const grid = [...prev[currentView]];
              for (let i = 0; i < grid.length; i++)
                if (grid[i]?.serverId === item.serverId) grid[i] = null;
              return { ...prev, [currentView]: grid };
            });
            addToAvailableModules({ ...item, id: item.catalog, photo: catalogPhotoMap[item.catalog] });
          },
          onError: err => console.error("Failed to delete module:", err)
        });
      } else {
        addToAvailableModules(item);
      }
      return;
    }

    // New module from catalog
    if (!item.serverId) {
      const payload = {
        orient: item.orient ?? 0,
        w: item.w ?? 1,
        h: item.h ?? 1,
        name: item.name,
        price: item.price ?? 0,
        weight: item.weight ?? 0,
        x: col,
        y: row,
        z: item.z ?? 0,
        catalog: item.id,
        project: id
      };

      const photo = catalogPhotoMap[item.id] ?? "";

      createModule(payload, {
        onSuccess: createdItem => {
          if (!createdItem.id) return;
          setViews(prev => {
            const grid = [...prev[currentView]];
            for (let h = 0; h < (item.h ?? 1); h++) {
              for (let w = 0; w < (item.w ?? 1); w++) {
                const index = (row! - 1 + h) * ROW_SIZE + (col! - 1 + w);
                if (index < grid.length) {
                  grid[index] = { ...createdItem, serverId: createdItem.id, photo };
                }
              }
            }
            return { ...prev, [currentView]: grid };
          });
          setAvailableModules(prev => prev.filter(i => i.id !== item.id));
        },
      });
      return;
    }

    // Move existing module inside grid
    if (item.serverId) {
      setViews(prev => {
        const grid = [...prev[currentView]];
        for (let i = 0; i < grid.length; i++)
          if (grid[i]?.serverId === item.serverId) grid[i] = null;
        if (destIndex !== null) grid[destIndex] = { ...item, x: col, y: row };
        return { ...prev, [currentView]: grid };
      });

      updateModule({ id: item.serverId, data: { ...item, x: col, y: row } }, {
        onSuccess: res => console.log("Module updated:", res),
        onError: err => console.error("Failed to update module:", err)
      });
    }
  };

  return (
    <div className="project__content_container">
      {settingsOpen && id && (
        <ProjectWrapper projectId={String(id)} onClose={() => setSettingsOpen(false)} />
      )}
      <Navbar
        topName={projectData?.name}
        prevName={viewNames.root}
        onBackClick={goBack}
        onOpenResources={() => setIsModalOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />
      {isModalOpen && <MaterialModal onClose={() => setIsModalOpen(false)} />}
      <div className="project__content_main">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={rectIntersection}
        >
          <Catalog
            items={availableModules}
            firstButton="Модулі"
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <div className="main__content">
            <div className="zoom-toolbar">
              {viewStack.length > 1 && (
                <button className="project__back_btn" onClick={goBack}>🔙 Back</button>
              )}
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