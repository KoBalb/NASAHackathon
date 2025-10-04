import "./ProjecrCardsStyles.css";
import PlusSign from "../../images/plus-sign.png"

function CreateProjectCard() {
    return (
        <button className="prjct-card create">
            <img className="plus-sign" src={PlusSign}></img>
            <h2>створити</h2>
        </button>
    )
}

export default CreateProjectCard;