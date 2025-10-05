import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../../components/project/Catalog/Catalog";
import Grid from "../../../../../components/project/Grid/Grid";
import "../../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartment } from "../../../../../hooks/Compartmentshooks/compartments_hooks";
import { useZones, useUpdateZone } from "../../../../../hooks/Zoneshooks/zones_hooks";

import { useParams, useNavigate } from "react-router-dom";

const INITIAL_GRID = Array(12).fill(null);
const ROW_SIZE = 4;

type CompartmentsHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
};

export default function Compartments() {
    const { projectId, moduleId, compartmentId } = useParams<CompartmentsHrefIdTypization>();
    const navigate = useNavigate();

    const projectPk = projectId ? Number(projectId) : undefined;
    const modulePk = moduleId ? Number(moduleId) : undefined;
    const compartmentPk = compartmentId ? Number(compartmentId) : undefined;

    const { data: compData } = useCompartment(projectPk as number, modulePk as number, compartmentPk as number);
    const { data: moduleData } = useModule(projectPk as number, modulePk as number);
    const { data: zonesData } = useZones(projectPk as number, modulePk as number, compartmentPk as number);

    const updateZone = useUpdateZone(projectPk as number, modulePk as number, compartmentPk as number);

    const [views, setViews] = useState<Record<string, (string | null)[]>>({ root: [...INITIAL_GRID] });
    const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
    const [catalogItems, setCatalogItems] = useState<string[]>([]);
    const [viewNames, setViewNames] = useState<Record<string, string>>({ root: "Compartment" });

    // Инициализация каталога и сетки
    useEffect(() => {
        if (!zonesData) return;

        const dimensions: Record<string, { width: number; height: number }> = {};
        const newGrid: (string | null)[] = [...INITIAL_GRID];

        setCatalogItems(zonesData.filter(z => !z.x && !z.y).map(z => z.name));

        for (const z of zonesData) {
            dimensions[z.name] = { width: z.w, height: z.h };

            if (z.x && z.y) {
                const x0 = z.x - 1;
                const y0 = z.y - 1;
                for (let h = 0; h < z.h; h++) {
                    for (let w = 0; w < z.w; w++) {
                        const index = (y0 + h) * ROW_SIZE + (x0 + w);
                        if (index < newGrid.length && x0 + w < ROW_SIZE) newGrid[index] = z.name;
                    }
                }
            }
        }

        setItemDimensions(prev => ({ ...prev, ...dimensions }));
        setViews({ root: newGrid });
    }, [zonesData]);

    // Обновление navbar title
    useEffect(() => {
        if (compData?.name) setViewNames(prev => ({ ...prev, root: compData.name }));
    }, [compData]);

    function handleZoneDoubleClick(index: number) {
        const label = views.root[index];
        if (!label) return;
        const zone = zonesData?.find(z => z.name === label);
        if (!zone) return;

        navigate(
            `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zone.id}`
        );
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
        const zone = zonesData?.find(z => z.name === label);
        if (!zone) return;

        setViews(prev => {
            const copy = { ...prev };

            // Удаляем старый блок
            const srcArr = [...(copy.root ?? [])];
            for (let i = 0; i < srcArr.length; i++) {
                if (srcArr[i] === label) srcArr[i] = null;
            }
            copy.root = srcArr;

            // Выкинули за пределы → каталог
            if (!destView || typeof destIndex !== "number") {
                if (fromGrid) setCatalogItems(prev => (prev.includes(label) ? prev : [...prev, label]));
                updateZone.mutate({ id: zone.id, data: { ...zone, x: 0, y: 0 } });
                return copy;
            }

            const destArr = [...(copy[destView] ?? Array(12).fill(null))];

            // Определяем верхний левый квадрат блока
            const colStart = destIndex % ROW_SIZE;
            const rowStart = Math.floor(destIndex / ROW_SIZE);

            // Проверка, что блок влезает и клетки пустые
            let fits = true;
            for (let h = 0; h < height; h++) {
                const rowOffset = (rowStart + h) * ROW_SIZE;
                for (let w = 0; w < width; w++) {
                    const idx = rowOffset + colStart + w;
                    if (colStart + w >= ROW_SIZE || idx >= destArr.length || destArr[idx] !== null) {
                        fits = false;
                        break;
                    }
                }
                if (!fits) break;
            }
            if (!fits) return prev;

            // Заполняем сетку
            for (let h = 0; h < height; h++) {
                const rowOffset = (rowStart + h) * ROW_SIZE;
                for (let w = 0; w < width; w++) {
                    destArr[rowOffset + colStart + w] = label;
                }
            }
            copy[destView] = destArr;

            // Удаляем из каталога
            if (!fromGrid) setCatalogItems(prev => prev.filter(i => i !== label));

            // Сохраняем позицию
            updateZone.mutate({ id: zone.id, data: { ...zone, x: colStart + 1, y: rowStart + 1 } });

            return copy;
        });
    }


    return (
        <div className="project__content_container">
            <Navbar
                topName={viewNames.root}
                prevName={moduleData?.name}
                onBackClick={() => navigate(`/projects/${projectPk}/modules/${modulePk}`)}
            />

            <div className="project__content_main">
                <DndContext onDragEnd={handleDragEnd} collisionDetection={rectIntersection}>
                    <Catalog
                        items={catalogItems}
                        firstButton="Зони"
                        selectedFilter="Зони"
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
                                        rowSize={ROW_SIZE} // <-- передаём ROW_SIZE сюда
                                        onSquareDoubleClick={handleZoneDoubleClick}
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