import { useDroppable, useDraggable } from "@dnd-kit/core";
import GridItem from "../GridItem/GridItem";
import "./Grid.css";

type GridProps = {
  viewId: string;
  items: (string | null)[];
  onSquareDoubleClick?: (index: number) => void;
};

export default function Grid({ viewId, items, onSquareDoubleClick }: GridProps) {
  return (
    <div className="grid__container">
      {items.map((label, idx) => (
        <GridSquare
          key={idx}
          viewId={viewId}
          index={idx}
          item={label}
          onDoubleClick={onSquareDoubleClick}
        />
      ))}
    </div>
  );
}

function GridSquare({ viewId, index, item, onDoubleClick }: any) {
  const droppableId = `${viewId}-square-${index}`;
  const { isOver, setNodeRef } = useDroppable({ id: droppableId });

  const { attributes, listeners, setNodeRef: setItemRef, transform } = useDraggable({
    id: item ? `grid-${viewId}-${index}` : `empty-${viewId}-${index}`,
    disabled: !item,
    data: { fromGrid: !!item, index, viewId, label: item },
  });

  const itemStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 }
    : {};

  return (
    <div
      ref={setNodeRef}
      className="grid__cell"
      style={{ backgroundColor: isOver ? "#9c9c9cff" : undefined }}
      onDoubleClick={() => onDoubleClick?.(index)}
    >
      {item ? (
        <div ref={setItemRef} {...listeners} {...attributes} style={{ ...itemStyle, width: "100%", height: "100%" }}>
          <GridItem label={item} />
        </div>
      ) : (
        <div className="grid__empty">+</div>
      )}
    </div>
  );
}