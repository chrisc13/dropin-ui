import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import "./Popup.css"

interface PopupProps {
  title: string;
  isOpen: boolean;
  setClose: Function;
  children?: ReactNode;
  footer?: ReactNode;
}

export const Popup: React.FC<PopupProps> = ({ title, isOpen, setClose, children, footer }) => {

    if (!isOpen) return null;  
    const popupContent = (
        <div className="overlay">
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>{title}</h2>
            <div className="popup-body">{children}</div>
            <div className="popup-footer">
              <button
                className="close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setClose();
                }}
              >
                Close
              </button>
              {footer && <>{footer}</>}
            </div>
          </div>
        </div>
      );
    
      return ReactDOM.createPortal(popupContent, document.body);
};
