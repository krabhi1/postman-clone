export default function MyInput(props: {
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
    className="box"
      type="text"
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  );
}
