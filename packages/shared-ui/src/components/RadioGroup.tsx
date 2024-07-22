import React, { useEffect, useState } from "react";
import { reactChildren } from "../others/utils";
import "../styles/radio.css";
type RadioGroupProps = React.PropsWithChildren & {
  activeIndex?: number;
  onChange?: (index: number, key: string) => void;
};
export default function RadioGroup(props: RadioGroupProps) {
  const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);
  const children = reactChildren<RadioItemProps>({
    children: props.children,
    filter: (child) => {
      return child.type === RadioItem;
    },
  });
  function handleOnChange(index: number, key: string) {
    setActiveIndex(index);
    props.onChange?.(index, key);
  }
  useEffect(() => {
    setActiveIndex(props.activeIndex || 0);
  }, [props.activeIndex]);

  return (
    <form className="radio-group">
      {children.map((child, index) => {
        const id = "" + (child.key || child.props.value || index);
        return (
          <div key={index} className="radio-item">
            <input
              checked={activeIndex === index}
              id={id}
              type="radio"
              name={"radio-group"}
              value={child.props.value}
              onChange={() =>
                handleOnChange(
                  index,
                  (child.key || "").toString().replace(/\.\$/g, "")
                )
              }
            />
            <label htmlFor={id}>{child.props.value}</label>
          </div>
        );
      })}
    </form>
  );
}

type RadioItemProps = {
  value: string;
};
export function RadioItem(_props: RadioItemProps) {
  return null;
}

export function RadioGroupExample() {
  return (
    <RadioGroup
      activeIndex={1}
      onChange={(index, key) => console.log(index, key)}
    >
      <RadioItem key={"abhishek"} value="123" />
      <RadioItem key={"ball"} value="nitesh" />
      <RadioItem key={"cat"} value="kumar" />
    </RadioGroup>
  );
}
