import { isTextBasedContentType, objToKeyValuesString } from "@others/utils";

type ResponsePanelProps = {
  contentType?: string;
  data?: any;
  errorMessage?: string;
  size: number;
  onClear?: () => void;
  onCopy?: () => void;
  isLoading: boolean;
  isError: boolean;
  headers?: Record<string, string>;
};

export function ResponsePanel(props: ResponsePanelProps) {
  const { isLoading, onClear, onCopy, contentType, data } = props;

  if (isLoading) {
    return <div className="res-panel">Loading...</div>;
  }

  const isSuccess = props.data !== undefined;

  return (
    <div className="res-panel">
      <div className="header">
        <div>
          <button className="btn primary" onClick={onClear}>
            clear
          </button>
          <button className="btn primary" onClick={onCopy}>
            copy
          </button>
        </div>
      </div>
      <div className="content">
        <RenderContent contentType={contentType} data={data} />
      </div>
    </div>
  );
}

function RenderContent({
  contentType,
  data,
}: Pick<ResponsePanelProps, "contentType" | "data">) {
  const isTextBased = isTextBasedContentType(contentType);

  return <textarea disabled value={data + ""} />;
}
