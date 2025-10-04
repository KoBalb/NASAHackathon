import { DndContext } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../components/project/Catalog/Catalog";
import Grid from "../../../../components/project/Grid/Grid";
import "../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartments } from "../../../../hooks/Compartmentshooks/compartments_hooks";
import { useProject } from "../../../../hooks/Projectshooks/project_hooks";

import { useParams, useNavigate } from "react-router-dom";

type ModulesHrefIdTypization = {
    projectId: string;
    moduleId: string;
};

function Modules() {
    const { projectId, moduleId } = useParams<ModulesHrefIdTypization>();
    const navigate = useNavigate();

    const projectPk = projectId ? Number(projectId) : undefined;
    const modulePk = moduleId ? Number(moduleId) : undefined;

    const { data: compData } = useCompartments(projectPk as number, modulePk as number);
    const { data: moduleData } = useModule(projectPk as number, modulePk as number);
    const { data: projectData } = useProject(projectPk as number)

    const INITIAL_GRID = Array(12).fill(null);

    const [views, setViews] = useState<Record<string, (string | null)[]>>({
        root: [...INITIAL_GRID],
    });
    const [catalogItems, setCatalogItems] = useState<string[]>([]);
    const [viewNames, setViewNames] = useState<Record<string, string>>({
        root: "Module",
    });

    useEffect(() => {
        if (compData && Array.isArray(compData)) {
            setCatalogItems(compData.map((c) => c.name));
            setViews({ root: [...INITIAL_GRID] });
        }
    }, [compData]);

    useEffect(() => {
        if (moduleData?.name) {
            setViewNames((prev) => ({ ...prev, root: moduleData.name }));
        }
    }, [moduleData]);

    // ✅ Double-click handler for items inside the grid
    function handleSquareDoubleClick(index: number) {
        const label = views.root[index]; // get the label stored in the square
        if (!label) return;

        const comp = compData?.find((c) => c.name === label); // lookup by name
        if (!comp) return;

        navigate(`/projects/${projectPk}/modules/${modulePk}/compartments/${comp.id}`);
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

        setViews((prev) => {
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
                }
            }

            return copy;
        });

        if (!activeData.fromGrid && destView && typeof destIndex === "number") {
            setCatalogItems((prev) => prev.filter((i) => i !== label));
        }

        if (!over && activeData.fromGrid) {
            setCatalogItems((prev) => [...prev, label]);
        }
    }

    return (
        <div className="project__content_container">
            <Navbar
                topName={viewNames.root}
                prevName={projectData?.name}
                onBackClick={() => navigate(`/projects/${projectPk}`)}
            />

            <div className="project__content_main">
                <DndContext onDragEnd={handleDragEnd}>
                    <Catalog
                        items={catalogItems}
                        onItemRemove={(id) => setCatalogItems((prev) => prev.filter((i) => i !== id))}
                    />

                    <div className="main__content">
                        <div className="zoom-wrapper">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="root"
                                    initial={{ scale: 0.92, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.92, opacity: 0 }}
                                    transition={{ duration: 0.22 }}
                                >
                                    <Grid
                                        viewId="root"
                                        items={views.root}
                                        onSquareDoubleClick={handleSquareDoubleClick}
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

export default Modules;