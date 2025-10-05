import "./StartBuildButtonStyle.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartBuildButton() {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/projects")}
      className={`build-btn ${hovered ? "pulse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Почати будівництво
    </button>
  );
}

export default StartBuildButton;