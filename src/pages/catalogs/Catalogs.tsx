import NavigationBar from "../../components/general/NavBar";
import "../../components/general/PageStyles.css";
import CatalogSearchBar from "../../components/catalogs/SearchBar/CatalogSearchBar";
import CatalogBar from "../../components/catalogs/CatalogsCard/CatalogBar";
import { motion } from "framer-motion";


function Catalogs() {
    return (
        <div className="home-page">
            <NavigationBar />
            <main>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <CatalogSearchBar />
				    <CatalogBar />
                </motion.div>
            </main>
        </div>
    )
}

export default Catalogs;
