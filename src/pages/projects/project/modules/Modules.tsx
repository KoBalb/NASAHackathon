// Modules.tsx
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../components/project/Catalog/Catalog";
import Grid from "../../../../components/project/Grid/Grid";
import "../../../../components/project/ProjectPage.css";

import {
    useCompartments,
    useCreateCompartment,
    useUpdateCompartment,
    useDeleteCompartment,
} from "../../../../hooks/Compartmentshooks/compartments_hooks";
import { useModule } from "../../../../hooks/Moduleshooks/modules_hooks";
import { useProject } from "../../../../hooks/Projectshooks/project_hooks";
import { useCatalogsQuery } from "../../../../hooks/Catalogshooks/catalogs_hooks";

import { useParams, useNavigate } from "react-router-dom";
import MaterialModal from "../../../../wrappers/resourceListModal";
import { ProjectWrapper } from "../../../../wrappers/project_form_wrapper";

const ROW_SIZE = 4;
const INITIAL_GRID = Array(12).fill(null);

export default function Modules() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [views, setViews] = useState<Record<string, (any | null)[]>>({ root: [...INITIAL_GRID] });
    const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Відсіки");
    const [availableCompartments, setAvailableCompartments] = useState<any[]>([]);
    const [viewStack] = useState<string[]>(["root"]);
    const [viewNames] = useState<Record<string, string>>({ root: "Module Builder" });

    const navigate = useNavigate();
    const { projectId, moduleId } = useParams<{ projectId: string; moduleId: string }>();

    const projectPk = Number(projectId);
    const modulePk = Number(moduleId);

    const { data: compartmentsData } = useCompartments(projectPk as number, modulePk as number);
    const { data: moduleData } = useModule(projectPk as number, modulePk as number);
    const { data: projectData } = useProject(projectPk as number);
    const { data: catalogsData } = useCatalogsQuery();

    const { mutate: createCompartment } = useCreateCompartment(projectPk as number, modulePk as number);
    const { mutate: updateCompartment } = useUpdateCompartment(projectPk as number, modulePk as number);
    const { mutate: deleteCompartment } = useDeleteCompartment(projectPk as number, modulePk as number);

    useEffect(() => {
        if (!compartmentsData) return;

        console.log("==== useEffect triggered ====");
        console.log("projectPk:", projectPk);
        console.log("modulePk:", modulePk);
        console.log("compartmentsData:", compartmentsData);
        console.log("catalogsData:", catalogsData);

        // 🔹 Берем все компартменты, без фильтрации по модулю
        const moduleCompartments = compartmentsData;

        console.log("Using all compartments:", moduleCompartments);

        const newGrid: (any | null)[] = Array(
            Math.max(INITIAL_GRID.length, moduleCompartments.length * ROW_SIZE)
        ).fill(null);

        const dimensions: Record<string, { width: number; height: number }> = {};

        moduleCompartments.forEach((item) => {
            // используем id вместо name, чтобы не перезаписывались размеры одинаковых имён
            dimensions[item.id] = { width: item.w ?? 1, height: item.h ?? 1 };

            console.log(
                `Placing compartment ${item.id} (${item.name}) at x:${item.x}, y:${item.y}`
            );

            if (item.x != null && item.y != null) {
                const index = (item.y - 1) * ROW_SIZE + (item.x - 1);
                console.log("Calculated grid index:", index);
                newGrid[index] = { ...item, serverId: item.id };
            } else {
                console.warn("Compartment has no x/y:", item);
            }
        });

        console.log("Final grid:", newGrid);

        setItemDimensions(dimensions);
        setViews({ root: newGrid });

        compartmentsData?.forEach((c) => {
            console.log("Compartment raw:", c);
        });

        const newAvailable =
            catalogsData?.filter(
                (c) => c.type === "CM" && !moduleCompartments.some((m) => m.catalog === c.id)
            ) ?? [];

        console.log("Available compartments:", newAvailable);

        setAvailableCompartments(newAvailable);
    }, [compartmentsData, catalogsData]);

    const currentView = viewStack[viewStack.length - 1];
    const goBack = () => navigate(`/projects/${projectPk}`);

    const pushChildView = (index: number) => {
        const item = views[currentView]?.[index];
        if (!item) return;
        const compartment = compartmentsData?.find((c) => c.id === item.serverId);
        if (compartment) navigate(`/projects/${projectPk}/modules/${modulePk}/compartments/${compartment.id}`);
    };

    const addToAvailableCompartments = (item: any) => {
        setAvailableCompartments((prev) => {
            const newArr = [...prev, item];
            return newArr.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);
        });
    };

    const handleDragStart = () => {
        document.body.style.overflow = "hidden";
    };

    const handleDragEnd = (event: any) => {
        document.body.style.overflow = "";

        const { active, over } = event;
        const item = active?.data?.current?.item;
        if (!item) return;

        const match = over?.id?.match(/^(.+)-square-(\d+)$/);
        const destIndex = match ? Number(match[2]) : null;
        const col = destIndex !== null ? (destIndex % ROW_SIZE) + 1 : null;
        const row = destIndex !== null ? Math.floor(destIndex / ROW_SIZE) + 1 : null;

        const droppedOutsideGrid = !over || !over.id.startsWith(`${currentView}-square-`);

        // === Удаление из грида (выброс за пределы) ===
        if (droppedOutsideGrid) {
            if (item.serverId) {
                deleteCompartment(item.serverId, {
                    onSuccess: () => {
                        setViews(prev => {
                            const grid = [...prev[currentView]];
                            for (let i = 0; i < grid.length; i++)
                                if (grid[i]?.serverId === item.serverId) grid[i] = null;
                            return { ...prev, [currentView]: grid };
                        });
                        addToAvailableCompartments({ ...item, id: item.catalog });
                    },
                    onError: err => console.error("❌ Failed to delete compartment:", err),
                });
            } else {
                addToAvailableCompartments(item);
            }
            return;
        }

        // === Новый отсек из каталога ===
        if (!item.serverId) {
            const payload = {
                w: item.w ?? 1,
                h: item.h ?? 1,
                d: item.d ?? 1,
                name: item.name,
                price: item.price ?? 0,
                weight: item.weight ?? 0,
                comment: item.comment ?? "",
                x: col,
                y: row,
                z: item.z ?? 0,
                catalog: item.id,
                project: projectPk,
                module: modulePk,
            };

            createCompartment(payload, {
                onSuccess: createdItem => {
                    if (!createdItem.id) return console.error("Server did not return id!");
                    const newItem = { ...createdItem, serverId: createdItem.id, module: modulePk };
                    setViews(prev => {
                        const grid = [...prev[currentView]];
                        while (destIndex !== null && grid.length <= destIndex) grid.push(null);
                        if (destIndex !== null) grid[destIndex] = newItem;
                        return { ...prev, [currentView]: grid };
                    });
                    setAvailableCompartments(prev => prev.filter(i => i.id !== item.id));
                },
                onError: err => console.error("❌ Failed to create compartment:", err),
            });
            return;
        }

        // === Перемещение существующего отсека внутри грида ===
        if (item.serverId) {
            // Обновляем грид сразу локально
            setViews(prev => {
                const grid = [...prev[currentView]];
                for (let i = 0; i < grid.length; i++) if (grid[i]?.serverId === item.serverId) grid[i] = null;
                while (destIndex !== null && grid.length <= destIndex) grid.push(null);
                if (destIndex !== null) grid[destIndex] = { ...item, x: col, y: row };
                return { ...prev, [currentView]: grid };
            });

            // Отправляем PATCH на сервер
            updateCompartment({ id: item.serverId, data: { ...item, x: col, y: row } }, {
                onSuccess: res => console.log("✅ Compartment updated:", res),
                onError: err => console.error("❌ Failed to update compartment:", err),
            });
        }
    };

    return (
        <div className="project__content_container">
            {settingsOpen && projectPk && (
                <ProjectWrapper projectId={String(projectPk)} onClose={() => setSettingsOpen(false)} />
            )}
            <Navbar
                topName={moduleData?.name}
                prevName={projectData?.name}
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
                        items={availableCompartments}
                        firstButton="Відсіки"
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                    />
                    <div className="main__content">
                        <div className="zoom-toolbar">
                            {viewStack.length > 1 && (
                                <button className="project__back_btn" onClick={goBack}>
                                    🔙 Back
                                </button>
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