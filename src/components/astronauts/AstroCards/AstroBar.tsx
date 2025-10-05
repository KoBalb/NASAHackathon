import "./AstroCardsStyle.css";
import CreateAstroCard from "./CreateAstroCard";
import AstronautCard from "./AstronautCard";

function AstroBar() {
  return (
    <div className="astro-card-container">
        <CreateAstroCard />
        <AstronautCard>піб 1</AstronautCard>
        <AstronautCard>Артем</AstronautCard>
        <AstronautCard>Мамут</AstronautCard>
    </div>
  );
}

export default AstroBar;