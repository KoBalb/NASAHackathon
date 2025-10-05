import { useState } from "react";

import ResourceForm from "../../components/ResourceForm/Resourceform";


function Astronauts() {
        

    const [modalOpen, setModalOpen] = useState(false);
    return( <>
      <button onClick={() => setModalOpen(true)}>
        Дasdddddddddddddddddd
      </button>
        
      {modalOpen && (
        <ResourceForm 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}
export default Astronauts;