// Modal.tsx
import React, { useState } from "react";
import "./redactorForm.css";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"stats" | "console">("stats");

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <div className="modal-header">
          <select>
            <option>На Марс</option>
            <option>На Венеру</option>
          </select>
          <button className="settings-btn">⚙</button>
        </div>

        <div className="modal-body">
          <p>Вага корабля: 72 000 тон</p>
          <p>Час у дорозі: 186 днів</p>

          <div className="tabs">
            <button
              className={activeTab === "stats" ? "active" : ""}
              onClick={() => setActiveTab("stats")}
            >
              Статистика
            </button>
            <button
              className={activeTab === "console" ? "active" : ""}
              onClick={() => setActiveTab("console")}
            >
              Консоль
            </button>
          </div>

          {activeTab === "stats" ? (
            <>
              {/* Компоненти */}
              <div className="section">
                <div className="section-header">Компоненти</div>
                <div className="list-item">
                  <span>Двигуни</span>
                  <span className="green">2/2</span>
                </div>
                <div className="list-item">
                  <span>Система зв’язку</span>
                  <span className="green">1/1</span>
                </div>
                <div className="list-item">
                  <span>Радіаційний захист</span>
                  <span className="yellow">3/4</span>
                </div>
                <div className="list-item">
                  <span>Антени</span>
                  <span className="yellow">4/5</span>
                </div>
                <div className="list-item">
                  <span>Житловий модуль</span>
                  <span className="green">2/2</span>
                </div>
              </div>

              {/* Ресурси */}
              <div className="section">
                <div className="section-header">Ресурси</div>
                <div className="list-item">
                  <span>Вода</span>
                  <span className="yellow">1200/1500 л</span>
                </div>
                <div className="list-item">
                  <span>Кисень</span>
                  <span className="red">8/12 балонів</span>
                </div>
                <div className="list-item">
                  <span>Їжа</span>
                  <span className="yellow">320/500 пайків</span>
                </div>
                <div className="list-item">
                  <span>Сонячна енергія</span>
                  <span className="green">9/10 батарей</span>
                </div>
                <div className="list-item">
                  <span>Паливо</span>
                  <span className="yellow">68/100 тонн</span>
                </div>
              </div>
            </>
          ) : (
            <div className="console">
              <p>⚠ Попередження: мало кисню!</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Закрити</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;