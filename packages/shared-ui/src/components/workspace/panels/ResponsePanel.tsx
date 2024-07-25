import { isTextBasedContentType } from "@others/utils";

type ResponsePanelProps = {
  contentType?: string;
  data?: any;
  size: number;
  onClear?: () => void;
  onCopy?: () => void;
  isLoading: boolean;
  isError: boolean;
};

export function ResponsePanel(props: ResponsePanelProps) {
  const { isLoading, onClear, onCopy, contentType, data } = props;

  if (isLoading) {
    return <div className="res-panel">Loading...</div>;
  }

  return (
    <div className="res-panel">
      <div className="header">
        <button className="btn primary" onClick={onClear}>
          clear
        </button>
        <button className="btn primary" onClick={onCopy}>
          copy
        </button>
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

  return <div>{isTextBased ? data : JSON.stringify(data, null, 2)}</div>;
}
