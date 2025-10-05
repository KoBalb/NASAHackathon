import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../../../../../../components/project/Navbar/Navbar";
import Catalog from "../../../../../../components/project/Catalog/Catalog";
import Grid from "../../../../../../components/project/Grid/Grid";
import "../../../../../../components/project/ProjectPage.css";

import { useModule } from "../../../../../../hooks/Moduleshooks/modules_hooks";
import { useCompartment } from "../../../../../../hooks/Compartmentshooks/compartments_hooks";
import { useZone } from "../../../../../../hooks/Zoneshooks/zones_hooks";

import { useParams, useNavigate } from "react-router-dom";

type ZonesHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
    zoneId: string;
};

function Zones() {
    const { projectId, moduleId, compartmentId, zoneId } = useParams<ZonesHrefIdTypization>();
    const navigate = useNavigate();

    const projectPk = projectId ? Number(projectId) : undefined;
    const modulePk = moduleId ? Number(moduleId) : undefined;
    const compartmentPk = compartmentId ? Number(compartmentId) : undefined;
    const zonePk = zoneId ? Number(zoneId) : undefined;

    const { data: compData } = useCompartment(projectPk as number, modulePk as number, compartmentPk as number);
    const { data: zoneData } = useZone(projectPk as number, modulePk as number, compartmentPk as number, zonePk as number);

    const INITIAL_GRID = Array(12).fill(null);
    const [views, setViews] = useState<Record<string, (string | null)[]>>({
        root: [...INITIAL_GRID],
    });

    // Double-click navigates to the current zone (or future details)
    function handleZoneClick() {
        if (!zoneData?.id) return;
        navigate(
            `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zoneData.id}`
        );
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!active || !over) return;

        const activeData = active?.data?.current ?? {};
        const label = activeData.label ?? active?.id;
        const srcView = activeData.viewId;
        const srcIndex = activeData.index;

        const destMatch = over.id?.match(/^(.+)-square-(\d+)$/);
        const destView = destMatch ? destMatch[1] : undefined;
        const destIndex = destMatch ? Number(destMatch[2]) : undefined;

        if (!destView || destIndex === undefined) return;

        setViews(prev => {
            const copy = { ...prev };

            // Remove from source if coming from grid
            if (activeData.fromGrid && srcView !== undefined && srcIndex !== undefined) {
                const arr = [...(copy[srcView] ?? [])];
                arr[srcIndex] = null;
                copy[srcView] = arr;
            }

            // Place in destination
            const destArr = [...(copy[destView] ?? [...INITIAL_GRID])];
            destArr[destIndex] = label;
            copy[destView] = destArr;

            return copy;
        });
    }

    return (
        <div className="project__content_container">
            <Navbar
                topName={zoneData?.name ?? "Zone"}
                prevName={compData?.name}
                onBackClick={() =>
                    navigate(`/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}`)
                }
            />

            <div className="project__content_main">
                <DndContext onDragEnd={handleDragEnd}>
                    {/* Catalogue is still rendered, just empty */}
                    <Catalog
                        items={[]}
                        onItemRemove={() => {}}
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
                                        onSquareDoubleClick={handleZoneClick}
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

export default Zones;