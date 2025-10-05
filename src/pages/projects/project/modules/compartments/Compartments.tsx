import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../../components/project/Catalog/Catalog";
import Grid from "../../../../../components/project/Grid/Grid";
import "../../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartment } from "../../../../../hooks/Compartmentshooks/compartments_hooks";
import { useZones, useCreateZone, useUpdateZone } from "../../../../../hooks/Zoneshooks/zones_hooks";
import { useCatalogsQuery } from "../../../../../hooks/Catalogshooks/catalogs_hooks";

import { useParams, useNavigate } from "react-router-dom";
import type { Zone } from "../../../../../types";

const INITIAL_GRID = Array(12).fill(null);
const ROW_SIZE = 4;

type ParamsType = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
};

type CatalogItem = {
    id: number;
    name: string;
    w: number;
    h: number;
    d?: number;
    price?: number;
    weight?: number;
    photo?: string;
};

export default function Compartments() {
    const { projectId, moduleId, compartmentId } = useParams<ParamsType>();
    const navigate = useNavigate();

    const projectPk = Number(projectId);
    const modulePk = Number(moduleId);
    const compartmentPk = Number(compartmentId);

    const { data: compData } = useCompartment(projectPk, modulePk, compartmentPk);
    const { data: moduleData } = useModule(projectPk, modulePk);
    const { data: zonesData } = useZones(projectPk, modulePk, compartmentPk);
    const { data: catalogsData } = useCatalogsQuery();

    const updateZone = useUpdateZone(projectPk, modulePk, compartmentPk);
    const createZone = useCreateZone(projectPk, modulePk, compartmentPk);

    const [views, setViews] = useState<Record<string, (any | null)[]>>({ root: [...INITIAL_GRID] });
    const [itemDimensions, setItemDimensions] = useState<Record<string, { width: number; height: number }>>({});
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    const [viewNames, setViewNames] = useState<Record<string, string>>({ root: "Compartment" });

    // 🔹 Словарь catalogId -> фото
    const catalogPhotoMap = catalogsData?.reduce<Record<number, string>>((acc, c) => {
        if (c.type === "ZN") acc[c.id] = c.photo ?? "";
        return acc;
    }, {}) ?? {};

    // Инициализация грида и каталога
    useEffect(() => {
        if (!zonesData || !catalogsData) return;

        const newGrid: (any | null)[] = [...INITIAL_GRID];
        const dimensions: Record<string, { width: number; height: number }> = {};

        zonesData.forEach(z => {
            dimensions[z.id] = { width: z.w, height: z.h };
            const photo = catalogPhotoMap[z.catalog] ?? "";

            if (z.x && z.y) {
                const x0 = z.x - 1;
                const y0 = z.y - 1;
                for (let h = 0; h < z.h; h++) {
                    for (let w = 0; w < z.w; w++) {
                        const idx = (y0 + h) * ROW_SIZE + (x0 + w);
                        if (idx < newGrid.length && x0 + w < ROW_SIZE) {
                            newGrid[idx] = { ...z, serverId: z.id, photo };
                        }
                    }
                }
            }
        });

        const availableCatalogs: CatalogItem[] = catalogsData
            .filter(c => c.type === "ZN")
            .filter(c => !zonesData.some(z => z.catalog === c.id))
            .map(c => ({
                id: c.id,
                name: c.name,
                w: c.w,
                h: c.h,
                d: c.d ?? 1,
                price: c.price ?? 0,
                weight: c.weight ?? 0,
                photo: c.photo ?? "",
            }));

        setItemDimensions(dimensions);
        setViews({ root: newGrid });
        setCatalogItems(availableCatalogs);
    }, [zonesData, catalogsData]);

    useEffect(() => {
        if (compData?.name) setViewNames(prev => ({ ...prev, root: compData.name }));
    }, [compData]);

    const handleZoneDoubleClick = (index: number) => {
        const zoneObj = views.root[index];
        if (!zoneObj || !zoneObj.serverId) return;
        navigate(`/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zoneObj.serverId}`);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!active || !over) return;

        const activeData = active?.data?.current ?? {};
        let zoneId: number | undefined;
        let catalogId: number | undefined;

        if (activeData.item?.serverId) zoneId = activeData.item.serverId;
        else if (activeData.item?.id) catalogId = activeData.item.id;

        const zoneData = zonesData?.find(z => z.id === zoneId);
        const catalogData = catalogItems.find(c => c.id === catalogId);

        if (!zoneData && !catalogData) return;

        const overId = over?.id;
        const destMatch = overId ? overId.match(/^(.+)-square-(\d+)$/) : null;
        const destIndex = destMatch ? Number(destMatch[2]) : undefined;
        const colStart = destIndex !== undefined ? destIndex % ROW_SIZE : 0;
        const rowStart = destIndex !== undefined ? Math.floor(destIndex / ROW_SIZE) : 0;

        const width = zoneData?.w ?? catalogData?.w ?? 1;
        const height = zoneData?.h ?? catalogData?.h ?? 1;
        const photo = zoneData?.photo ?? catalogData?.photo ?? "";

        // --- Новая зона из каталога ---
        if (!zoneData && catalogData && destIndex !== undefined) {
            const payload: Zone = {
                w: width,
                h: height,
                d: catalogData.d ?? 1,
                name: catalogData.name ?? "Zone",
                price: catalogData.price ?? 0,
                weight: catalogData.weight ?? 0,
                x: colStart + 1,
                y: rowStart + 1,
                z: 0,
                catalog: catalogData.id,
                project: projectPk,
                compartment: compartmentPk,
            };

            createZone.mutate(payload, {
                onSuccess: created => {
                    setViews(prev => {
                        const newGrid = [...(prev.root ?? [])];
                        for (let h = 0; h < height; h++) {
                            const rowOffset = (rowStart + h) * ROW_SIZE;
                            for (let w = 0; w < width; w++) {
                                const idx = rowOffset + colStart + w;
                                if (idx < newGrid.length) {
                                    newGrid[idx] = { ...created, serverId: created.id, photo };
                                }
                            }
                        }
                        return { ...prev, root: newGrid };
                    });
                    setCatalogItems(prev => prev.filter(c => c.id !== catalogData.id));
                },
            });
            return;
        }

        // --- Существующая зона ---
        if (zoneData && destIndex !== undefined) {
            setViews(prev => {
                const copy = { ...prev };
                const gridArr = [...(copy.root ?? [])];

                gridArr.forEach((cell, idx) => {
                    if (cell?.serverId === zoneData.id) gridArr[idx] = null;
                });

                let fits = true;
                for (let h = 0; h < height; h++) {
                    const rowOffset = (rowStart + h) * ROW_SIZE;
                    for (let w = 0; w < width; w++) {
                        const idx = rowOffset + colStart + w;
                        if (colStart + w >= ROW_SIZE || idx >= gridArr.length || (gridArr[idx] !== null && gridArr[idx]?.serverId !== zoneData.id)) {
                            fits = false;
                            break;
                        }
                    }
                    if (!fits) break;
                }

                if (!fits) {
                    for (let i = 0; i < gridArr.length; i++) {
                        if (views.root[i]?.serverId === zoneData.id) gridArr[i] = { ...zoneData, serverId: zoneData.id, photo };
                    }
                    return { ...copy, root: gridArr };
                }

                for (let h = 0; h < height; h++) {
                    const rowOffset = (rowStart + h) * ROW_SIZE;
                    for (let w = 0; w < width; w++) {
                        const idx = rowOffset + colStart + w;
                        if (idx < gridArr.length) {
                            gridArr[idx] = { ...zoneData, serverId: zoneData.id, photo };
                        }
                    }
                }

                updateZone.mutate({ id: zoneData.id, data: { ...zoneData, x: colStart + 1, y: rowStart + 1 } });

                copy.root = gridArr;
                return copy;
            });
        }
    };

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
                        keyExtractor={item => item.id}
                        onFilterChange={() => {}}
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