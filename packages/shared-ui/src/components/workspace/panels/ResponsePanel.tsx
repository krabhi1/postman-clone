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

  return <div>{isTextBased ? data : JSON.stringify(data, null, 2)}</div>;
}

///test
const url = "http://localhost:3000/api/v1/fetch";
const method = "POST";
const xmlLink = "https://www.w3schools.com/xml/plant_catalog.xml";

function serverFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: any
) {
  const serverUrl = "http://localhost:3000/api/v1/fetch";

  const pmc_headers = objToKeyValuesString(headers);
  const pmc_others = objToKeyValuesString({ method });
  const pmc_url = url;
  fetch(serverUrl, {
    method: "POST",
    headers: {
      pmc_headers,
      pmc_others,
      pmc_url,
    },
    body: body,
  });
}

function sendNone() {
  fetch(url, {
    method,
    body: null,
  });
}

function sendRaw() {
  fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name: "test" }),
  });
}

function sendFormData() {
  const formData = new FormData();
  formData.append("name", "test");
  //a binary data
  const bin = new Uint8Array([1, 2, 3, 4, 5]);
  formData.append("bin", new Blob([bin]));
  fetch(url, {
    method,
    body: formData,
  });
}

async function sendBinary() {
  const bin = new Uint8Array([1, 2, 3, 4, 5]);
  const r = await fetch(url, {
    method,
    headers: {
      "content-type": "application/octet-stream",
    },
    body: new Blob([bin]),
  });
}

function sendUrlEncoded() {
  const data: Record<string, string> = { name: "test", age: "20" };

  // Convert data object to URL-encoded string
  const urlEncodedData = new URLSearchParams(data).toString();
  fetch(url, {
    method,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: urlEncodedData,
  });
}
