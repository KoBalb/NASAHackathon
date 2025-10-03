import { useParams } from "react-router-dom";

type ModulesHrefIdTypization = {
    projectId: string;
    moduleId: string;
}

function Modules(){
     const { projectId, moduleId} = useParams<ModulesHrefIdTypization>();

    return (
    <div>
        <h1>modules Page</h1>
        <h1>Project: {projectId}</h1>
        <h1>Module: {moduleId}</h1>
    </div>
    );
};

export default Modules;