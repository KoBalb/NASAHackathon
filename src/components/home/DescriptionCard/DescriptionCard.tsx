import "./DesCardStyle.css"

type CardProps = {
    head: string;
    text: string;
};

function DesriptionCard({head, text}: CardProps) {
    return (
        <div className="des-card">
            <h3>{head}</h3>
            <p>{text}</p>
        </div>
    )
}

export default DesriptionCard;