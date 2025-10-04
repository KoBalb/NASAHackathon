import "./SearchStyles.css";
import SearchInput from "./SearchInput";
import FilterButton from "./FilterButton";
import TegsButton from "./TegsButton";

function SearchBar() {
  return (
    <div className="search-bar">
      <SearchInput />
      <FilterButton />
      <TegsButton />
    </div>
  );
}

export default SearchBar;
