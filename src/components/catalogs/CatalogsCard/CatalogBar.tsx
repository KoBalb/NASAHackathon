import CreateCatalogCard from "./CreateCatalogCard";
import CatalogCard from "./CatalogCard";
import "./CatalogCardsStyles.css";

function CatalogBar() {
  return (
    <div className="card-container">
        <CreateCatalogCard />
        <CatalogCard teg="#">Житлово-побутовий відсік</CatalogCard>
        <CatalogCard teg="#">Лабораторія</CatalogCard>
        <CatalogCard teg="#">Логістичний відсік</CatalogCard>
        <CatalogCard teg="#">Спортивний відсік</CatalogCard>
    </div>
  );
}

export default CatalogBar;