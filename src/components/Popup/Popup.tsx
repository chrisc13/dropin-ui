import { ReactNode, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import "./Popup.css"

interface PopupProps {
  title: string;
  isOpen: boolean;
  setClose: Function;
  children?: ReactNode;
  footer?: ReactNode;
}

export const Popup: React.FC<PopupProps> = ({ title, isOpen, setClose, children, footer }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;  

    const handleSubmitButton = () =>{
        setTimeout(() => {
            setIsLoading(false)
            setClose();
        }, 2000);
        setIsLoading(true)
    }

    return (
        <div className="overlay">
        <div className="popup">
            {isLoading && <LoadingSpinner></LoadingSpinner>}
            <h2>{title}</h2>
            <div className="popup-body">{children}</div>
            <div className="popup-footer">
                <button className="close-button" onClick={() => setClose()}>Close</button>
                {footer && <>{footer}</>}
            </div>
        </div>
        </div>
  );
};
