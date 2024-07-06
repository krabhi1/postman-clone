import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../styles/menu.css";
export type MenuItem = string;
export type MenuProps = {
  items: MenuItem[];
  isPopup?: boolean;
  position?: { x: number; y: number };
  onItemSelect?: (item: MenuItem) => void;
};
export type MenuHandle = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export const _Menu = forwardRef<MenuHandle, MenuProps>(
  (
    {
      items,
      isPopup = true,
      position = { x: 100, y: 100 },
      onItemSelect,
    }: MenuProps,
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuMainRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (isOpen) {
          //check click is outside of menu
          const targetElement = e.target as HTMLElement;
          if (!targetElement.matches(".menu")) {
            setIsOpen(false);
          }
        }
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [setIsOpen, isOpen]);
    useImperativeHandle(ref, () => {
      return {
        show: () => {
          setIsOpen(true);
        },
        hide: () => {
          setIsOpen(false);
        },
        toggle: () => {
          setIsOpen((old) => !old);
        },
      };
    }, []);
    function handleClick(item: MenuItem) {
      onItemSelect?.(item);
    }
    return (
      isOpen && (
        <div
          ref={menuMainRef}
          className="menu"
          style={{
            left:position.x,
            top:position.y,
          }}
        >
          <div className="dropdown">
            {items.map((item) => (
              <div key={item} onClick={() => handleClick(item)}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )
    );
  }
);

export const Menu = memo(_Menu);
