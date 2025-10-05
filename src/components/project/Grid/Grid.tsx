import { useDroppable, useDraggable } from "@dnd-kit/core";
import "./Grid.css";

type GridProps = {
  viewId: string;
  items: (any | null)[];
  itemDimensions: Record<string, { width: number; height: number }>;
  rowSize: number;
  onSquareDoubleClick?: (index: number) => void;
};

export default function Grid({ viewId, items, itemDimensions, rowSize, onSquareDoubleClick }: GridProps) {
  const renderedIndexes = new Set<number>();

  return (
    <div className="grid__container">
      {items.map((item, idx) => {
        if (!item) return <GridSquare key={`empty-${idx}`} viewId={viewId} index={idx} item={null} />;

        const dimensions = itemDimensions[item.name] || { width: 1, height: 1 };
        if (renderedIndexes.has(idx)) return null;

        for (let h = 0; h < dimensions.height; h++) {
          for (let w = 0; w < dimensions.width; w++) {
            renderedIndexes.add(idx + w + h * rowSize);
          }
        }

        return (
          <GridSquare
            key={item.serverId ?? item.id ?? `grid-${idx}`}
            viewId={viewId}
            index={idx}
            item={item}
            dimensions={dimensions}
            onDoubleClick={onSquareDoubleClick}
          />
        );
      })}
    </div>
  );
}

type GridSquareProps = {
  viewId: string;
  index: number;
  item: any | null;
  dimensions?: { width: number; height: number };
  onDoubleClick?: (index: number) => void;
};

function GridSquare({ viewId, index, item, dimensions, onDoubleClick }: GridSquareProps) {
  const droppableId = `${viewId}-square-${index}`;
  const { isOver, setNodeRef } = useDroppable({ id: droppableId, data: { index } });

  const { attributes, listeners, setNodeRef: setItemRef, transform } = useDraggable({
    id: item ? `grid-${viewId}-${item.id}` : `empty-${viewId}-${index}`,
    disabled: !item,
    data: { item, fromGrid: !!item },
  });

  const itemStyle = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 } : {};
  const gridStyle = dimensions ? { gridColumn: `span ${dimensions.width}`, gridRow: `span ${dimensions.height}` } : {};
  const highlightStyle = isOver ? { outline: "2px solid #4caf50", outlineOffset: "-2px" } : {};

  return (
    <div
      ref={setNodeRef}
      className="grid__cell"
      style={{ ...gridStyle, ...highlightStyle }}
      onDoubleClick={() => onDoubleClick?.(index)}
    >
      {item ? (
        <div ref={setItemRef} {...listeners} {...attributes} style={{ ...itemStyle, width: "100%", height: "100%" }}>
          {item.photo ? (
            <img src={item.photo} alt={item.name} className="grid__item_photo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <div className="grid__item">{item.name}</div>
          )}
        </div>
      ) : (
        <div className="grid__empty">+</div>
      )}
    </div>
  );
}