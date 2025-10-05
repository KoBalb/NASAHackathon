import NavigationBar from "../../components/general/NavBar";
import "../../components/general/PageStyles.css";
import SearchBar from "../../components/projects/SearchBar/SearchBar";
import ProjectsBar from "../../components/projects/ProjectsCards/ProjectsBar";
import { motion } from "framer-motion";


function Projects() {
    return (
        <div className="home-page">
            <NavigationBar />
            <main>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <SearchBar />
				    <ProjectsBar />
                </motion.div>
            </main>
        </div>
    )
}

export default Projects;
