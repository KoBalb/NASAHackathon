import "./CatalogSearchStyles.css";
import CatalogSearchInput from "./CatalogSearchInput";
import CatalogFilterButton from "./CatalogFilterButton";
import CatalogTegsButton from "./CatalogTegsButton";

function CatalogSearchBar() {
  return (
    <div className="search-bar">
      <CatalogSearchInput />
      <CatalogFilterButton />
      <CatalogTegsButton />
    </div>
  );
}

export default CatalogSearchBar;
