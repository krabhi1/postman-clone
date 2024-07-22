import {
  Body,
  Collection,
  CollectionItem,
  HttpMethod,
  RequestItem,
} from "common-utils/types";
import BreadCrumb from "../../BreadCrumb";
import TabItem from "../../tab/TabItem";
import TabView from "../../tab/TabView";
import Table, { Column, RowData } from "../../Table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Omit2, PartialWithMust } from "common-utils";
import RadioGroup, { RadioItem } from "../../RadioGroup";
import { Menu } from "../../Menu";
import Dropdown from "../../Dropdown";
type RequestPanelProps = {
  collectionId: string;
  request: RequestItem;
  path: string;
  onHttpMethodChange?: (method: HttpMethod) => void;
  onUrlChange?: (value: string) => void;
  onSendRequest?: () => void;
  updateRequestItem: (item: Partial<RequestItem>) => void;
};
export function RequestPanel({
  path,
  collectionId,
  request,
  ...props
}: RequestPanelProps) {
  return (
    <div className="req-panel">
      {/*  BreadCrumb*/}
      <BreadCrumb path={path} />
      {/* input box */}
      <RequestInputBox
        onUrlChange={props.onUrlChange}
        onHttpMethodChange={props.onHttpMethodChange}
        collectionId={collectionId}
        request={request}
        updateRequestItem={props.updateRequestItem}
      />
      {/* request tab */}
      <RequestTabView
        request={request}
        onUrlChange={props.onUrlChange}
        updateRequestItem={props.updateRequestItem}
      />
      {/* query tab */}
    </div>
  );
}

type RequestViewerProps = Omit2<RequestPanelProps, "path" | "onSendRequest">;
function RequestInputBox(props: RequestViewerProps) {
  const { method, url } = props.request;
  return (
    <div className="input-box">
      <div className="input-area">
        <select
          value={method}
          onChange={(e) =>
            props?.onHttpMethodChange?.(e.target.value as HttpMethod)
          }
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <span></span>
        <input
          value={url}
          onChange={(e) => props?.onUrlChange?.(e.target.value)}
          type="text"
          placeholder="https://example.com"
        />
      </div>
      <button className="btn primary">Send</button>
    </div>
  );
}

function RequestTabView(
  props: Pick<
    RequestViewerProps,
    "onUrlChange" | "request" | "updateRequestItem"
  >
) {
  return (
    <div className="req-tab">
      <TabView>
        <TabItem header="Params">
          <ParamsTabItem
            request={props.request}
            onUrlChange={props.onUrlChange}
          />
        </TabItem>
        <TabItem header="Authorization">Authorization</TabItem>
        <TabItem header="Headers">Headers</TabItem>
        <TabItem header="Body">
          <BodyTabItem
            body={props.request.body}
            onBodyChange={(body) => {
              props.updateRequestItem({ body });
            }}
          />
        </TabItem>
      </TabView>
    </div>
  );
}
function ParamsTabItem(
  props: Pick<RequestViewerProps, "request" | "onUrlChange">
) {
  const {
    request: { url },
    onUrlChange,
  } = props;

  const lastUrlRef = useRef("");
  const [data, setData] = useImmer<RowData[]>([]);
  const isUpperUpdate = useRef(false);
  useEffect(() => {
    if (url === lastUrlRef.current) return;
    lastUrlRef.current = url;
    try {
      const urlObj = new URL(url);
      const keyValues = Array.from(urlObj.searchParams.entries());
      isUpperUpdate.current = true;
      setData((draft) => {
        const items: RowData[] = [];
        keyValues.forEach(([key, value], i) => {
          const existingRow = draft.find((row) => row.data.key === key);
          if (existingRow) {
            if (existingRow.data.value !== value) {
              items.push({ data: { key, value, description: "" } });
            } else {
              items.push(existingRow);
            }
          } else {
            items.push({ data: { key, value, description: "" } });
          }
        });
        return items;
      });
    } catch (error) {
      console.error("invalid url", url);
      isUpperUpdate.current = true;
      setData([]);
    }
  }, [url]);

  useEffect(() => {
    //avoid call when data is changed by upper useEffect
    if (isUpperUpdate.current) {
      isUpperUpdate.current = false;
      return;
    }
    try {
      const params = data
        .map((row) => `${row.data.key}=${row.data.value}`)
        .join("&");
      const urlObj = new URL(url);
      urlObj.search = params;
      const newUrl = urlObj.href;
      if (newUrl === url) return;
      lastUrlRef.current = newUrl;
      onUrlChange?.(newUrl);
    } catch (error) {
      console.error("invalid url", url);
    }
  }, [data]);

  return (
    <Table
      onEdit={(i, k, v) => {
        setData((draft) => {
          draft[i].data[k] = v;
        });
      }}
      onDelete={(i) => {
        setData((draft) => {
          draft.splice(i, 1);
        });
      }}
      onAdd={(k, v) => {
        setData((draft) => {
          draft.push({
            data: { key: "", value: "", description: "", [k]: v },
          });
        });
      }}
      data={data}
    >
      <Column header="Key" field="key" />
      <Column canAdd={false} header="Value" field="value" />
      <Column canAdd={false} header="Description" field="description" />
    </Table>
  );
}

type BodyTabItemProps = {
  body: Body;
  onBodyChange?: (body: Body) => void;
};
const options = ["none", "form-data", "x-www-form-urlencoded", "raw", "binary"];
const rawOptions = ["text", "json", "javascript", "html", "xml"];
function BodyTabItem(props: BodyTabItemProps) {
  const [activeRawOption, setActiveRawOption] = useState(rawOptions[0]);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const activeOption = options[activeOptionIndex];
  return (
    <div className="body-tab-item">
      {/* header */}
      <div className="header">
        <RadioGroup
          activeIndex={activeOptionIndex}
          onChange={(i) => setActiveOptionIndex(i)}
        >
          {options.map((option) => (
            <RadioItem key={option} value={option} />
          ))}
        </RadioGroup>
        {activeOption === "raw" && (
          <Dropdown
            items={rawOptions}
            activeItem={activeRawOption}
            onItemSelect={setActiveRawOption} //TODO update headers
          />
        )}
      </div>
      {/* content */}
      <BodyTabItemContent
        body={props.body}
        onBodyChange={props.onBodyChange}
        option={activeOption}
        rawOption={activeRawOption}
      />
    </div>
  );
}
type BodyTabItemContentProps = {
  body: Body;
  onBodyChange?: (body: Body) => void;
  option: string;
  rawOption: string;
};
function BodyTabItemContent(props: BodyTabItemContentProps) {
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
    return <RawBodyContent {...props} />;
  }

  return <div></div>;
}

function RawBodyContent(props: BodyTabItemContentProps) {
  const {
    body: { data, type },
    onBodyChange,
    rawOption,
    option,
  } = props;
  return (
    <textarea
      onChange={(e) => {
        onBodyChange?.({ data: e.target.value, type });
      }}
      value={data}
    />
  );
}
