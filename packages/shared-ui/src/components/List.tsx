import { Children } from "react";

export default function List(props: { children?: React.ReactNode }) {
  const childs = Children.toArray(props.children);
  console.log({ childs });
  return (
    <div className="list">
      {childs.map((child, i) => (
        <div key={i} className="box">
          {child}
        </div>
      ))}
    </div>
  );
}

type FixedBoxProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
};
export function FixedBox(props: FixedBoxProps) {
  return <div style={{ ...props.style }}>{props.children}</div>;
}
