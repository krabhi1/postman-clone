import Table, { RowData, Column } from "@components/Table";
import { useRef, useEffect } from "react";
import { useImmer } from "use-immer";
import { RequestPanelProps } from "../RequestPanel";

export function ParamsTabItem(
  props: Pick<RequestPanelProps, "request" | "onUrlChange">
) {
  const {
    request: { url }, onUrlChange,
  } = props;

  console.log("headers",props.request.headers)

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
