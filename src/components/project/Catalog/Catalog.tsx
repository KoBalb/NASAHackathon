import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import GridItem from "../GridItem/GridItem.tsx";

import SearchIcon from "../../../assets/icons/search_icon.svg";
import "./Catalog.css";

type CatalogProps = {
  items: string[];
  onItemRemove: (id: string) => void;
  firstButton: string;
  secondButton?: string;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
};

function CatalogItem({ label, index }: { label: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `catalog-${label}`,
    data: { fromGrid: false, label, catalogIndex: index },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <GridItem label={label} />
    </div>
  );
}

export default function Catalog({ items, firstButton, secondButton, selectedFilter, onFilterChange }: CatalogProps) {

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
              <img
                className="catalog__main_input_icon"
                src={SearchIcon}
                alt="Search icon"
              />
            </button>
            <input
              className="catalog__main_input"
              type="text"
              placeholder="Пошук..."
            />
          </div>
        </div>
        <div className="catalog__main_grid">
          {items.map((label, idx) => (
            <CatalogItem
              key={idx}
              label={label}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}