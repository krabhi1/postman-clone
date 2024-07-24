import { HttpMethod } from "common-utils/types";
import { RequestPanelProps } from "./RequestPanel";

export function RequestInputBox(
  props: Pick<
    RequestPanelProps,
    "request" | "onHttpMethodChange" | "onUrlChange" | "collectionId"
  >
) {
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
