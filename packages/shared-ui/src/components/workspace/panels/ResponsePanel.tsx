import TabItem from "@components/tab/TabItem";
import TabView from "@components/tab/TabView";
import Table, { Column, RowData } from "@components/Table";
import { isTextBasedContentType, objToKeyValuesString } from "@others/utils";

type ResponsePanelProps = {
  errorMessage?: string;
  onClear?: () => void;
  onCopy?: () => void;
  isLoading: boolean;
  isError: boolean;
  headers?: Record<string, string>;
  contentType?: string;
  statusCode?: string;
  status?: string;
  res?: {
    data: any;
    size: number;
  };
};


export function ResponsePanel(props: ResponsePanelProps) {
  const { contentType, isLoading, onClear, onCopy, res } = props;
  const { data } = res || {};

  if (isLoading) {
    return <div className="res-panel">Loading...</div>;
  }

  const isSuccess = data !== undefined;

  return (
    <div className="res-panel">
      <div className="header">
        <StatusInfo
          status={props.status || ""}
          statusCode={props.statusCode || ""}
          size={res?.size || 0}
        />
        <div className="tools">
          <button className="btn primary" onClick={onClear}>
            clear
          </button>
          <button className="btn primary" onClick={onCopy}>
            copy
          </button>
        </div>
      </div>
      <div className="content">
        {isSuccess ? (
          <TabView>
            <TabItem header="Body">
              <RenderContent contentType={contentType} res={res} />
            </TabItem>
            <TabItem header="Headers">
              <RenderHeaders headers={props.headers || {}} />
            </TabItem>
          </TabView>
        ) : (
          <div className="error">{props.errorMessage}</div>
        )}
      </div>
    </div>
  );
}

function StatusInfo({
  status,
  statusCode,
  size,
}: {
  status: string;
  statusCode: string;
  size: number;
}) {
  const kb= (size / 1024).toFixed(2)
  return (
    <div className="status">
      <span>status: {statusCode} {status} </span>
      <span>size:{kb}kb</span>
    </div>
  );
}
function RenderContent({
  contentType,
  res,
}: Pick<ResponsePanelProps, "res" | "contentType">) {
  const isTextBased = isTextBasedContentType(contentType);

  return <textarea disabled value={res?.data + ""} />;
}

function RenderHeaders({ headers }: { headers: Record<string, string> }) {
  const data: RowData[] = headers
    ? Object.entries(headers).map(([key, value]) => ({
        data: { key, value },
        isReadOnly: true,
      }))
    : [];
  return (
    <Table data={data}>
      <Column header="key" field="key" />
      <Column header="value" field="value" />
    </Table>
  );
}
