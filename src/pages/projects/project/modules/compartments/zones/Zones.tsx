import { useParams } from "react-router-dom";


type ZonesHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
    zoneId: string;
}

function Zones(){
 const { projectId, moduleId, compartmentId, zoneId } = useParams<ZonesHrefIdTypization>();

  
    
    return (
    <div>
        <h1>Zones Page</h1>
        <h1>Project: {projectId}</h1>
        <h1>Module: {moduleId}</h1>
        <h1>Compartment: {compartmentId}</h1>
        <h1>Zone: {zoneId}</h1>
    </div>
    );
};

export default Zones;