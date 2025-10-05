import { useState } from "react";

import ResourceManager from "../../components/resourcesCard/ResourcesCard";


function Astronauts() {
        

    const [modalOpen, setModalOpen] = useState(false);
    return( <>
      {/* <button onClick={() => setModalOpen(true)}>
        Дasdddddddddddddddddd
      </button>
        
      {modalOpen && (
        <ResourceForm 
          onClose={() => setModalOpen(false)} 
        />
      )} */}
      <ResourceManager/>
    </>
  );
}
export default Astronauts;