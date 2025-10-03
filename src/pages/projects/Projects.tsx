import { useParams } from "react-router-dom";

type ProjectsHrefIdTypization = {
    projectId: string;
}

function Projects() {
    const { projectId} = useParams<ProjectsHrefIdTypization>();
	return (
		<div>
			<h1>Projects Page</h1>
            <h1>Project: {projectId}</h1>
		</div>
	);
}

export default Projects;
