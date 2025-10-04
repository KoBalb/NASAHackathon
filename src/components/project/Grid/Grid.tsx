import { useDraggable, useDroppable } from "@dnd-kit/core";
import "./Grid.css";

import GridItem from "../GridItem/GridItem";

type GridProps = {
  items: (string | null)[];
  onDrop?: (item: string, index: number) => void;
};

function Grid({ items, onDrop }: GridProps) {
  return (
    <div className="grid__container">
      {items.map((label, idx) => (
        <GridSquare
          key={idx}
          index={idx}
          item={label}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}

export default Grid;

function GridSquare({ index, item }: any) {
  const { isOver, setNodeRef } = useDroppable({ id: `square-${index}` });

  const { attributes, listeners, setNodeRef: setItemRef, transform } =
    useDraggable({
      id: item ?? '',
      disabled: !item,
      data: { fromGrid: true, index },
    });

  const itemStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : {};

  return (
    <div
      ref={setNodeRef}
      className="grid__item"
      style={{ backgroundColor: isOver ? "#e0f7fa" : undefined }}
    >
      {item && (
        <div
          ref={setItemRef}
          {...listeners}
          {...attributes}
          style={{
            ...itemStyle,
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
        >
          <GridItem label={item} />
        </div>
      )}
    </div>
  );
}