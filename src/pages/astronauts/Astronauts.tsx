import NavigationBar from "../../components/general/NavBar";
import "../../components/general/PageStyles.css";
import AstroSearchBar from "../../components/astronauts/AstroSearchBar/AstroSearchBar";
import AstroBar from "../../components/astronauts/AstroCards/AstroBar";

function Astronauts() {
  return (
    <div className="home-page">
      <NavigationBar />
      <main>
        <AstroSearchBar />
        <AstroBar />
      </main>
    </div>
  );
}

export default Astronauts;
