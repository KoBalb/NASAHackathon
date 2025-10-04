import { useState } from "react";
import "./SearchStyles.css";

function SearchInput() {
  const [Search, setSearch] = useState("");
  return (
    <input
      type="text"
      placeholder="Пошук проєктів..."
      className="search-input"
    />
  );
}

export default SearchInput;
