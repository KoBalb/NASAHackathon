import NavigationBar from "../../components/general/NavBar";
import "../../components/general/PageStyles.css";
import CatalogSearchBar from "../../components/catalogs/SearchBar/CatalogSearchBar";
import CatalogBar from "../../components/catalogs/CatalogsCard/CatalogBar";


function Catalogs() {
    return (
        <div className="home-page">
            <NavigationBar />
            <main>
                <CatalogSearchBar />
				<CatalogBar />
            </main>
        </div>
    )
}

export default Catalogs;
