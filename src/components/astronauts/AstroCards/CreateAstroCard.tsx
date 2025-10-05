import "./AstroCardsStyle.css";
import PlusSign from "../../images/plus-sign.png";


function CreateAstroCard() {
  return (
      <button className="astro-card create">
        <img className="astro-plus-sign" src={PlusSign} alt="plus sign" />
        <h2>додати</h2>
      </button>
  );
}

export default CreateAstroCard;