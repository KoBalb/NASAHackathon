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

    const navigate = useNavigate();
    const { projectId, moduleId } = useParams<{ projectId: string; moduleId: string }>();

    const projectPk = Number(projectId);
    const modulePk = Number(moduleId);

    const { data: compartmentsData } = useCompartments(projectPk, modulePk);
    const { data: moduleData } = useModule(projectPk, modulePk);
    const { data: projectData } = useProject(projectPk);
    const { data: catalogsData } = useCatalogsQuery();

    const { mutate: createCompartment } = useCreateCompartment(projectPk, modulePk);
    const { mutate: updateCompartment } = useUpdateCompartment(projectPk, modulePk);
    const { mutate: deleteCompartment } = useDeleteCompartment(projectPk, modulePk);

    // 🔹 Мапа catalogId -> photo
    const catalogPhotoMap = catalogsData?.reduce<Record<number, string>>((acc, c) => {
        if (c.type === "CM") acc[c.id] = c.photo ?? "";
        return acc;
    }, {}) ?? {};

    useEffect(() => {
        if (!compartmentsData) return;

        const newGrid: (any | null)[] = Array(
            Math.max(INITIAL_GRID.length, compartmentsData.length * ROW_SIZE)
        ).fill(null);

        const dimensions: Record<string, { width: number; height: number }> = {};

        compartmentsData.forEach((item) => {
            dimensions[item.id] = { width: item.w ?? 1, height: item.h ?? 1 };

            const photo = catalogPhotoMap[item.catalog] ?? "";

            if (item.x != null && item.y != null) {
                const index = (item.y - 1) * ROW_SIZE + (item.x - 1);
                newGrid[index] = { ...item, serverId: item.id, photo };
            }
        });

        setItemDimensions(dimensions);
        setViews({ root: newGrid });

        const newAvailable =
            catalogsData?.filter(
                (c) => c.type === "CM" && !compartmentsData.some((m) => m.catalog === c.id)
            ).map(c => ({ ...c, photo: c.photo ?? "" })) ?? [];

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
                        addToAvailableCompartments({ ...item, id: item.catalog, photo: catalogPhotoMap[item.catalog] });
                    },
                });
            } else {
                addToAvailableCompartments(item);
            }
            return;
        }

        // Новый отсек из каталога
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

            const photo = catalogPhotoMap[item.id] ?? "";

            createCompartment(payload, {
                onSuccess: createdItem => {
                    if (!createdItem.id) return;
                    const newItem = { ...createdItem, serverId: createdItem.id, photo, module: modulePk };
                    setViews(prev => {
                        const grid = [...prev[currentView]];
                        if (destIndex !== null) grid[destIndex] = newItem;
                        return { ...prev, [currentView]: grid };
                    });
                    setAvailableCompartments(prev => prev.filter(i => i.id !== item.id));
                },
            });
            return;
        }

        // Перемещение существующего отсека
        if (item.serverId) {
            setViews(prev => {
                const grid = [...prev[currentView]];
                for (let i = 0; i < grid.length; i++) if (grid[i]?.serverId === item.serverId) grid[i] = null;
                if (destIndex !== null) grid[destIndex] = { ...item, x: col, y: row };
                return { ...prev, [currentView]: grid };
            });

            updateCompartment({ id: item.serverId, data: { ...item, x: col, y: row } });
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