import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../components/project/Catalog/Catalog";
import Grid from "../../../../components/project/Grid/Grid";
import "../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartments, useUpdateCompartmentFlexible } from "../../../../hooks/Compartmentshooks/compartments_hooks";
import { useProject } from "../../../../hooks/Projectshooks/project_hooks";

import { useParams, useNavigate } from "react-router-dom";

const INITIAL_GRID = Array(12).fill(null);
const ROW_SIZE = 4;

type ModulesHrefIdTypization = {
    projectId: string;
    moduleId: string;
};

export default function Modules() {
    const { projectId, moduleId } = useParams<ModulesHrefIdTypization>();
    const navigate = useNavigate();

    const projectPk = projectId ? Number(projectId) : undefined;
    const modulePk = moduleId ? Number(moduleId) : undefined;

    const { data: compData } = useCompartments(projectPk as number, modulePk as number);
    const { data: moduleData } = useModule(projectPk as number, modulePk as number);
    const { data: projectData } = useProject(projectPk as number);

    const updateCompartment = useUpdateCompartmentFlexible(projectPk as number, modulePk as number);

    const [views, setViews] = useState<Record<string, (string | null)[]>>({ root: [...INITIAL_GRID] });
    const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
    const [catalogItems, setCatalogItems] = useState<string[]>([]);
    const [viewNames, setViewNames] = useState<Record<string, string>>({ root: "Module" });

    // Инициализация каталога и сетки
    useEffect(() => {
        if (!compData) return;

        const dimensions: Record<string, { width: number; height: number }> = {};
        const newGrid: (string | null)[] = [...INITIAL_GRID];

        setCatalogItems(compData.filter(c => !c.x && !c.y).map(c => c.name));

        for (const c of compData) {
            dimensions[c.name] = { width: c.w, height: c.h };

            if (c.x && c.y) {
                const x0 = c.x - 1;
                const y0 = c.y - 1;
                for (let h = 0; h < c.h; h++) {
                    for (let w = 0; w < c.w; w++) {
                        const index = (y0 + h) * ROW_SIZE + (x0 + w);
                        if (index < newGrid.length) newGrid[index] = c.name;
                    }
                }
            }
        }

        setItemDimensions(prev => ({ ...prev, ...dimensions }));
        setViews({ root: newGrid });
    }, [compData]);

    // Обновление navbar title
    useEffect(() => {
        if (moduleData?.name) setViewNames(prev => ({ ...prev, root: moduleData.name }));
    }, [moduleData]);

    function handleSquareDoubleClick(index: number) {
        const label = views.root[index];
        if (!label) return;
        const comp = compData?.find(c => c.name === label);
        if (!comp) return;
        navigate(`/projects/${projectPk}/modules/${modulePk}/compartments/${comp.id}`);
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        const activeData = active?.data?.current ?? {};
        const label = activeData.label ?? active?.id;
        const fromGrid = activeData.fromGrid;

        const overId: string | undefined = over?.id;
        const destMatch = overId ? overId.match(/^(.+)-square-(\d+)$/) : null;
        const destView = destMatch ? destMatch[1] : undefined;
        const destIndex = destMatch ? Number(destMatch[2]) : undefined;

        const { width = 1, height = 1 } = itemDimensions[label] || {};
        const comp = compData?.find(c => c.name === label);
        if (!comp) return;

        setViews(prev => {
            const copy = { ...prev };

            // Удаляем из предыдущей сетки
            if (fromGrid) {
                const srcArr = [...(copy.root ?? [])];
                for (let i = 0; i < srcArr.length; i++) {
                    if (srcArr[i] === label) srcArr[i] = null;
                }
                copy.root = srcArr;
            }

            // Выкинули за пределы → каталог
            if (!destView || typeof destIndex !== "number") {
                if (fromGrid) setCatalogItems(prev => (prev.includes(label) ? prev : [...prev, label]));
                updateCompartment.mutate({ id: comp.id, data: { ...comp, x: 0, y: 0 } });
                return copy;
            }

            // Проверяем, влезает ли на сетку
            const colStart = destIndex % ROW_SIZE;
            const rowStart = Math.floor(destIndex / ROW_SIZE);
            const totalRows = Math.ceil((copy[destView]?.length ?? 12) / ROW_SIZE);

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

            // Если из каталога → удаляем
            if (!fromGrid) setCatalogItems(prev => prev.filter(i => i !== label));

            // Сохраняем позицию
            updateCompartment.mutate({ id: comp.id, data: { ...comp, x: colStart + 1, y: rowStart + 1 } });

            return copy;
        });
    }

    return (
        <div className="project__content_container">
            <Navbar
                topName={viewNames.root}
                prevName={projectData?.name}
                onBackClick={() => navigate(`/projects/${projectPk}`)}
            />

            <div className="project__content_main">
                <DndContext onDragEnd={handleDragEnd} collisionDetection={rectIntersection}>
                    <Catalog
                        items={catalogItems}
                        firstButton="Відсіки"
                        selectedFilter="Відсіки"
                        onFilterChange={() => { }}
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
                                        itemDimensions={itemDimensions}
                                        rowSize={ROW_SIZE}
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
