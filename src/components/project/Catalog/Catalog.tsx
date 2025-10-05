// Catalog.tsx
import { useDraggable } from "@dnd-kit/core";
import GridItem from "../GridItem/GridItem";
import SearchIcon from "../../../assets/icons/search_icon.svg";
import "./Catalog.css";

type CatalogItemType = {
  id: number;
  name: string;
  type: string;
  [key: string]: any;
};

type CatalogProps = {
  items: CatalogItemType[];
  firstButton: string;
  secondButton?: string;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
};

function CatalogItem({ item }: { item: CatalogItemType }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `catalog-${item.id}`,
    data: { fromGrid: false, item },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: "grab",
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <GridItem label={item.name} photo={item.photo} />
    </div>
  );
}

export default function Catalog({
  items,
  firstButton,
  secondButton,
  selectedFilter,
  onFilterChange,
}: CatalogProps) {
  return (
    <div className="catalog__container">
      <div className="catalog__filter_systems_container">
        <button
          className={`catalog__filter_system_btn ${selectedFilter === firstButton ? "catalog__filter_system_btn_active" : ""}`}
          onClick={() => onFilterChange(firstButton)}
        >
          {firstButton}
        </button>
        {secondButton && (
          <button
            className={`catalog__filter_system_btn ${selectedFilter === secondButton ? "catalog__filter_system_btn_active" : ""}`}
            onClick={() => onFilterChange(secondButton)}
          >
            {secondButton}
          </button>
        )}
      </div>

      <div className="catalog__catalog_container">
        <p className="catalog__catalog_text">Каталог</p>
        <button className="catalog__catalog_tags_btn">Теги</button>
      </div>

      <div className="catalog__main_container">
        <div className="catalog__main_input_wrapper">
          <div className="catalog__main_input_container">
            <button className="catalog__main_input_icon_btn">
              <img className="catalog__main_input_icon" src={SearchIcon} alt="Search icon" />
            </button>
            <input className="catalog__main_input" type="text" placeholder="Пошук..." />
          </div>
        </div>
        <div className="catalog__main_grid">
          {items.map(item => (
            <CatalogItem key={`catalog-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}