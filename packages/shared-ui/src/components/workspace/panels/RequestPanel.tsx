import { HttpMethod, RequestItem } from "common-utils/types";
import BreadCrumb from "../../BreadCrumb";
import TabItem from "../../tab/TabItem";
import TabView from "../../tab/TabView";
import Table, { Column, RowData } from "../../Table";
import { useState } from "react";
import { useImmer } from "use-immer";
type RequestPanelProps = {
  collectionId: string;
  request: RequestItem;
  path: string;
  onHttpMethodChange?: (method: HttpMethod) => void;
  onUrlChange?: (value: string) => void;
  onSendRequest?: () => void;
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
        onMethodChange={props.onHttpMethodChange}
        method={request.method}
        url={request.url}
      />
      {/* request tab */}
      <RequestTab />
      {/* query tab */}
    </div>
  );
}

type RequestViewerProps = {
  url: string;
  method: HttpMethod;
  onUrlChange?: (value: string) => void;
  onMethodChange?: (method: HttpMethod) => void;
};
function RequestInputBox(props: RequestViewerProps) {
  return (
    <div className="input-box">
      <div className="input-area">
        <select
          value={props.method}
          onChange={(e) =>
            props?.onMethodChange?.(e.target.value as HttpMethod)
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
          value={props.url}
          onChange={(e) => props?.onUrlChange?.(e.target.value)}
          type="text"
          placeholder="https://example.com"
        />
      </div>
      <button className="btn primary">Send</button>
    </div>
  );
}

function RequestTab() {
  const [data, setData] = useImmer<RowData[]>([
    {
      data: { key: "Content-Type", value: "application/json", description: "" },
      isReadOnly: true,
    },
    {
      data: { key: "Accept", value: "application/json", description: "" },
      isReadOnly: true,
    },
    {
      data: { key: "age", value: "20", description: "age of user" },
      isReadOnly: false,
    },
  ]);
  return (
    <div className="req-tab">
      <TabView>
        <TabItem header="Params">
          <Table
            onEdit={(i, k, v) => {
              setData((draft) => {
                draft[i].data[k] = v;
              });
              console.table(data);
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
            <Column header="Value" field="value" />
            <Column header="Description" field="description" />
          </Table>
        </TabItem>
        <TabItem header="Authorization">Authorization</TabItem>
        <TabItem header="Headers">Headers</TabItem>
        <TabItem header="Body">Body</TabItem>
      </TabView>
    </div>
  );
}
