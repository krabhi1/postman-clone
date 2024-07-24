import { useState } from "react";
import { Body } from "common-utils/types";
import Raw from "./items/Raw";
import Dropdown from "@components/Dropdown";
import RadioGroup, { RadioItem } from "@components/RadioGroup";

const options = ["none", "form-data", "x-www-form-urlencoded", "raw", "binary"];
const rawOptions = ["text", "json", "javascript", "html", "xml"];
type BodyTabItemProps = {
  body: Body;
};
export function BodyTabItem(props: BodyTabItemProps) {
  const [activeOptionIndex, setActiveOptionIndex] = useState(
    options.findIndex((o) => o === props.body.type)
  );

  const activeOption = options[activeOptionIndex];
  function updateOption(i: number) {
    setActiveOptionIndex(i);
    // props.onBodyChange?.({ ...props.body, type: options[i] as any });
  }
  function updateRawOption(option: string) {
    // props.onBodyChange?.({
    //   ...props.body,
    //   data: { ...props.body.data, type: option },
    // });
    //TODO update headers
  }
  const rawOption =
    props.body.type == "raw" ? props.body.data.type || "text" : "text";
  return (
    <div className="body-tab-item">
      {/* header */}
      <div className="header">
        <RadioGroup activeIndex={activeOptionIndex} onChange={updateOption}>
          {options.map((option) => (
            <RadioItem key={option} value={option} />
          ))}
        </RadioGroup>
        {activeOption === "raw" && (
          <Dropdown
            items={rawOptions}
            activeItem={rawOption}
            onItemSelect={updateRawOption}
          />
        )}
      </div>
      {/* content */}
      <Content
        body={props.body}
        option={activeOption}
        rawOption={rawOption}
      />
    </div>
  );
}

export type ContentProps = {
  body: Body;
  option: string;
  rawOption: string;

}

function Content(props: ContentProps) {
  if (props.option === "none") {
    return <div></div>;
  }
  if (props.option === "form-data") {
    return <div></div>;
  }
  if (props.option === "x-www-form-urlencoded") {
    return <div></div>;
  }
  if (props.option === "raw") {
    return <Raw {...props} />;
  }

  return <div></div>;
}
