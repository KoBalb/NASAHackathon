import NavigationBar from "../../components/general/NavBar";
import "../../components/general/PageStyles.css";
import SearchBar from "../../components/projects/SearchBar/SearchBar";
import ProjectsBar from "../../components/projects/ProjectsCards/ProjectsBar";


function Projects() {
    return (
        <div className="home-page">
            <NavigationBar />
            <main>
                <SearchBar />
				<ProjectsBar />
            </main>
        </div>
    )
}

export default Projects;
