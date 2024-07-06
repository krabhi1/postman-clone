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
  target?: HTMLElement;
  anchor?: { x: number; y: number };
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
      anchor = { x: 0.5, y: 0.5 },
      target = document.body,
      onItemSelect,
    }: MenuProps,
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuMainRef = useRef<HTMLDivElement>(null);
    console.log("menu rendered", target);
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (isOpen) {
          console.log("click outside", e.target, menuMainRef.current);
          //check click is outside of menu
          const targetElement = e.target as HTMLElement;
          if (!targetElement.matches(".menu")) {
            setIsOpen(false);
            console.log("t", targetElement.classList);
          }
          console.log("---");
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
      console.log("item clicked", item);
    }

    return (
      isOpen && (
        <div ref={menuMainRef} className="menu">
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
