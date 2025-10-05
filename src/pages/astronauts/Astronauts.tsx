<<<<<<< HEAD
import React from "react";
import ModuleForm from "../../components/redactorForm/redactorForm";
import ResourceManager from "../../components/resourcesCard/ResourcesCard";
import Modal from "../../components/redactorForm/redactorForm";


function Astronauts() {
        

 return (
    <div className="redactor-container">
      <div className="redactor-left">
        <ModuleForm />
      </div>
      <div className="redactor-right">
        <ResourceManager />
      </div>
    </div>
  );
};

export default Astronauts;
=======
import NavigationBar from "../../components/general/NavBar";
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
}
export default Astronauts;
>>>>>>> 1b7fcca29ea1809569e43b7172fb44e43c710968
