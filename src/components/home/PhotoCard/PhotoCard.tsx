import "./PhotoCardStyle.css";

interface PhotoCardProps {
  src: string;   // путь к изображению
  alt?: string;  // альтернативный текст (необязательно)
}

function PhotoCard({ src, alt = "Фото" }: PhotoCardProps) {
  return (
    <div className="photo-card">
      <img src={src} alt={alt} className="photo-card__image" />
    </div>
  );
}

export default PhotoCard;
