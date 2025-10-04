import "./GridItem.css"

type GridItemProps = {
  label: string;
};

export default function GridItem({ label }: GridItemProps) {
  return <div className="grid__item">{label}</div>;
}