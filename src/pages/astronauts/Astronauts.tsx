import AstroBar from "../../components/astronauts/AstroCards/AstroBar";
import AstroSearchBar from "../../components/astronauts/AstroSearchBar/AstroSearchBar";
import NavigationBar from "../../components/general/NavBar";

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
