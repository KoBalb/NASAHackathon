

import NavigationBar from "../../components/general/NavBar";
import AstroBar from "../../components/astronauts/AstroCards/AstroBar";
import AstroBar from "../../components/astronauts/AstroCards/AstroBar";
import AstroSearchBar from "../../components/astronauts/AstroSearchBar/AstroSearchBar";

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
