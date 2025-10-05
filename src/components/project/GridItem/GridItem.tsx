import "./GridItem.css";

type GridItemProps = {
  label?: string;
  photo?: string;
};

export default function GridItem({ label, photo }: GridItemProps) {
  return (
    <div className="grid__item">
      {photo ? (
        <img src={photo} alt={label ?? "Item photo"} className="grid__item_photo" />
      ) : (
        label
      )}
    </div>
  );
}