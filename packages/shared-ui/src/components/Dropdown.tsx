import { useEffect, useState } from "react";
import "../styles/drop-down.css";
type DropdownProps = {
  items: string[];
  onItemSelect?: (item: string) => void;
  activeItem: string;
};
export default function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  function handleClick() {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen) {
        //check click is outside of menu
        const targetElement = e.target as HTMLElement;
        if (targetElement.classList.contains("dropdown-button")) {
          return;
        }
        if (
          !targetElement.classList.contains("dropdown-button") &&
          !targetElement.matches(".dropdown")
        ) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setIsOpen, isOpen]);
  return (
    <div className="dropdown">
      <div onClick={handleClick} className="dropdown-button">
        {props.activeItem}
      </div>
      {isOpen && (
        <div className="dropdown-content">
          {props.items.map((item, index) => (
            <div key={index} onClick={() => props.onItemSelect?.(item)}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DropdownExample() {
  const items = ["item1", "item2", "item3"];
  const [activeItem, setActiveItem] = useState(items[0]);
  return (
    <Dropdown
      items={items}
      activeItem={activeItem}
      onItemSelect={setActiveItem}
    />
  );
}
