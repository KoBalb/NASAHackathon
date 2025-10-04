import "./StartBuildButtonStyle.css"
import { useState } from "react";


function StartBuildButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`build-btn ${hovered ? "pulse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Почати будівництво
    </button>
  );
}



export default StartBuildButton;