import { DndContext } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../../components/project/Catalog/Catalog";
import Grid from "../../../../../components/project/Grid/Grid";
import "../../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartment } from "../../../../../hooks/Compartmentshooks/compartments_hooks";
import { useZones } from "../../../../../hooks/Zoneshooks/zones_hooks";

import { useParams, useNavigate } from "react-router-dom";

type CompartmentsHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
};

function Compartments() {
    const { projectId, moduleId, compartmentId } = useParams<CompartmentsHrefIdTypization>();
    const navigate = useNavigate();

    const projectPk = projectId ? Number(projectId) : undefined;
    const modulePk = moduleId ? Number(moduleId) : undefined;
    const compartmentPk = compartmentId ? Number(compartmentId) : undefined;

    const { data: compData } = useCompartment(projectPk as number, modulePk as number, compartmentPk as number);
    const { data: moduleData } = useModule(projectPk as number, modulePk as number);
    const { data: zonesData } = useZones(projectPk as number, modulePk as number, compartmentPk as number);

    const INITIAL_GRID = Array(12).fill(null);

    const [views, setViews] = useState<Record<string, (string | null)[]>>({
        root: [...INITIAL_GRID],
    });

    const [catalogItems, setCatalogItems] = useState<string[]>([]);
    const [viewNames, setViewNames] = useState<Record<string, string>>({
        root: "Compartment",
    });

    const [selectedCompartmentId, setSelectedCompartmentId] = useState<number | null>(null);

    useEffect(() => {
        if (zonesData && Array.isArray(zonesData)) {
            setCatalogItems(zonesData.map((z) => z.name));
            setViews({ root: [...INITIAL_GRID] });
        }
    }, [zonesData]);

    useEffect(() => {
        if (compData?.name) {
            setViewNames((prev) => ({ ...prev, root: compData.name }));
        }
    }, [compData]);

    function handleZoneDoubleClick(index: number) {
        const zone = zonesData?.[index]; // get the zone corresponding to the clicked grid item
        if (!zone) return;

        navigate(
            `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zone.id}`
        );
    }

    useEffect(() => {
        if (!selectedCompartmentId || !zonesData) return;

        if (zonesData.length > 0) {
            // ✅ Navigate to the first zone
            navigate(
                `/projects/${projectPk}/modules/${modulePk}/compartments/${selectedCompartmentId}/zones/${zonesData[0].id}`
            );
        } else {
            // ❌ No zones exist, cannot navigate; maybe show toast or placeholder
            console.warn("No zones exist for this compartment");
        }

        setSelectedCompartmentId(null);
    }, [zonesData, selectedCompartmentId, navigate, projectPk, modulePk]);


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
                prevName={moduleData?.name}   // ✅ show module name as "previous"
                onBackClick={() => navigate(`/projects/${projectPk}/modules/${modulePk}`)}
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

export default Compartments;