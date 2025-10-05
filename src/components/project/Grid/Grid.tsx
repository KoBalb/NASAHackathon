import { useDroppable, useDraggable } from "@dnd-kit/core";
import "./Grid.css";

type GridProps = {
  viewId: string;
  items: (string | null)[];
  itemDimensions: Record<string, { width: number; height: number }>;
  rowSize: number;
  onSquareDoubleClick?: (index: number) => void;
};

export default function Grid({ viewId, items, itemDimensions, rowSize, onSquareDoubleClick }: GridProps) {
  const renderedIndexes = new Set<number>();

  return (
    <div className="grid__container">
      {items.map((label, idx) => {
        // если эта ячейка уже занята блоком, пропускаем
        if (renderedIndexes.has(idx)) return null;

        if (!label) return <GridSquare key={idx} viewId={viewId} index={idx} item={null} />;

        const dimensions = itemDimensions[label] || { width: 1, height: 1 };

        // добавляем все ячейки, которые занимает блок, в renderedIndexes
        for (let h = 0; h < dimensions.height; h++) {
          for (let w = 0; w < dimensions.width; w++) {
            const cellIdx = idx + w + h * rowSize;
            if (cellIdx < items.length) renderedIndexes.add(cellIdx);
          }
        }

        return (
          <GridSquare
            key={idx}
            viewId={viewId}
            index={idx}
            item={label}
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
  item: string | null;
  dimensions?: { width: number; height: number };
  onDoubleClick?: (index: number) => void;
};

function GridSquare({ viewId, index, item, dimensions, onDoubleClick }: GridSquareProps) {
  const droppableId = `${viewId}-square-${index}`;
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: { index, viewId, item },
  });

  const { attributes, listeners, setNodeRef: setItemRef, transform } = useDraggable({
    id: item ? `grid-${viewId}-${index}` : `empty-${viewId}-${index}`,
    disabled: !item,
    data: { fromGrid: !!item, index, viewId, label: item },
  });

  const itemStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 }
    : {};

  const gridStyle = dimensions
    ? { gridColumn: `span ${dimensions.width}`, gridRow: `span ${dimensions.height}` }
    : {};

  const highlightStyle = isOver
    ? { outline: "2px solid #4caf50", outlineOffset: "-2px" }
    : {};

  return (
    <div
      ref={setNodeRef}
      className="grid__cell"
      style={{ ...gridStyle, ...highlightStyle }}
      onDoubleClick={() => onDoubleClick?.(index)}
    >
      {item ? (
        <div ref={setItemRef} {...listeners} {...attributes} style={{ ...itemStyle, width: "100%", height: "100%" }}>
          <div className="grid__item">{item}</div>
        </div>
      ) : (
        <div className="grid__empty">+</div>
      )}
    </div>
  );
}