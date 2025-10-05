import "./CatalogCardsStyles.css";
import PlusSign from "../../images/plus-sign.png";


function CreateCatalogCard() {
  return (
      <button className="catalog-card create">
        <img className="plus-sign" src={PlusSign} alt="plus sign" />
        <h2>створити</h2>
      </button>
  );
}

export default CreateCatalogCard;