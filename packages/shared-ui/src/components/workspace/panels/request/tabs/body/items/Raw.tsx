import { ContentProps } from "../BodyTabItem";

export default function Raw(props: ContentProps) {
  const {
    body: { data, type },
    rawOption,
    option,
  } = props;
  return (
    <textarea
      onChange={(e) => {
        // onBodyChange?.({ data: e.target.value, type });
      }}
      value={data}
    />
  );
}
