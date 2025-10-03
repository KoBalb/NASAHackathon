import { useParams } from "react-router-dom";

type CompartmentsHrefIdTypization = {
    projectId: string;
    moduleId: string;
    compartmentId: string;
}

function Compartments(){
    const { projectId, moduleId, compartmentId} = useParams<CompartmentsHrefIdTypization>();

    return (
    <div>
        <h1>Compartments Page</h1>
        <h1>Project: {projectId}</h1>
        <h1>Module: {moduleId}</h1>
        <h1>Compartment: {compartmentId}</h1>
    </div>
    );
};

export default Compartments;