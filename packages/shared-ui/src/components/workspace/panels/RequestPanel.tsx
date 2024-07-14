import { HttpMethod, RequestItem } from "common-utils/types";
import BreadCrumb from "../../BreadCrumb";
import TabItem from "../../tab/TabItem";
import TabView from "../../tab/TabView";
import Table, { Column, RowData } from "../../Table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { PartialWithMust } from "common-utils";
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
      <RequestTabView url={request.url} onUrlChange={props.onUrlChange} />
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

function RequestTabView(
  props: Pick<RequestViewerProps, "url" | "onUrlChange">
) {
  return (
    <div className="req-tab">
      <TabView>
        <TabItem header="Params">
          <ParamsTabItem url={props.url} onUrlChange={props.onUrlChange} />
        </TabItem>
        <TabItem header="Authorization">Authorization</TabItem>
        <TabItem header="Headers">Headers</TabItem>
        <TabItem header="Body">Body</TabItem>
      </TabView>
    </div>
  );
}

function ParamsTabItem({
  url,
  onUrlChange,
}: Pick<RequestViewerProps, "url" | "onUrlChange">) {
  const lastUrlRef = useRef("");
  const [data, setData] = useImmer<RowData[]>([]);

  // const params = useMemo(
  //   () => data.map((row) => `${row.data.key}=${row.data.value}`).join("&"),
  //   [data]
  // );
  // console.log({ params });

  //url -> table ,block if url is changed by self
  useEffect(() => {
    if (url === lastUrlRef.current) return;
    lastUrlRef.current = url;
    try {
      const urlObj = new URL(url);
      const keyValues = Array.from(urlObj.searchParams.entries());
      setData((draft) => {
        let index = 0;
        const items = draft.reduce((acc, row, i) => {
          const [key, value] = keyValues[i] || [];
          index = i;
          //if new key
          if (key && row.data.key !== key) {
            acc.push({ data: { key, value, description: "" } });
          } else if (key && row.data.key === key) {
            //update row
            if (row.data.value !== value) {
              acc.push({ data: { key, value, description: "" } });
            } else {
              acc.push(row);
            }
          } else {
          }
          return acc;
        }, [] as RowData[]);

        //if keyValues is greater than data
        if (keyValues.length > draft.length) {
          for (let i = index + 1; i < keyValues.length; i++) {
            const [key, value] = keyValues[i];
            items.push({ data: { key, value, description: "" } });
          }
        }
        return items;
      });
    } catch (error) {
      console.error("invalid url", url);
    }
  }, [url]);

  //table -> url
  function updateUrl() {
    try {
      const params = data
        .map((row) => `${row.data.key}=${row.data.value}`)
        .join("&");
      const urlObj = new URL(url);
      urlObj.search = params;
      //don't convert url to
      const newUrl = decodeURIComponent(urlObj.toString());
      console.log({ urlObj, newUrl });
      if (newUrl === url) return;
      lastUrlRef.current = newUrl;
      onUrlChange?.(newUrl);
    } catch (error) {
      console.error("invalid url", url);
    }
  }

  return (
    <Table
      onEdit={(i, k, v) => {
        setData((draft) => {
          draft[i].data[k] = v;
        });
        updateUrl();
      }}
      onDelete={(i) => {
        setData((draft) => {
          draft.splice(i, 1);
        });
        updateUrl();
      }}
      onAdd={(k, v) => {
        setData((draft) => {
          draft.push({
            data: { key: "", value: "", description: "", [k]: v },
          });
        });
        updateUrl();
      }}
      data={data}
    >
      <Column header="Key" field="key" />
      <Column header="Value" field="value" />
      <Column header="Description" field="description" />
    </Table>
  );
}
