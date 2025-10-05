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