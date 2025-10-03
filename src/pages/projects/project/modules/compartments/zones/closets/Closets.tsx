import { useParams } from "react-router-dom";

export type ClosetsHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
    zoneId: string;
    closetsId: string;
}

function Closets(){
 const { projectId, moduleId, compartmentId, zoneId, closetsId } = useParams<ClosetsHrefIdTypization>();

  
    
    return (
    <div>
        <h1>Zones Page</h1>
        <h1>Project: {projectId}</h1>
        <h1>Module: {moduleId}</h1>
        <h1>Compartment: {compartmentId}</h1>
        <h1>Zone: {zoneId}</h1>
        <h1>Closets: {closetsId}</h1>
    </div>
    );
};

export default Closets;