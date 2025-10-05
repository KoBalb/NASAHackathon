import { useState } from "react";
import ResourceModal from "../../components/ResourceForm/Resourceform";


function Astronauts() {
    const [modalOpen, setModalOpen] = useState(false);
    return( <>
      <button onClick={() => setModalOpen(true)}>
        Добавить ресурс
      </button>

      {modalOpen && (
        <ResourceModal 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}
export default Astronauts;