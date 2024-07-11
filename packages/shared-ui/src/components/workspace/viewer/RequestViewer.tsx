import { HttpMethod } from "common-utils/types";
import Split from "react-split";
import "../../../styles/viewer.css";
import { RequestPanel } from "../panels/RequestPanel";
import { ResponsePanel } from "../panels/ResponsePanel";
export type RequestViewerProps = {
  id: string;
  collectionId: string;
  method: HttpMethod;
};

export default function RequestViewer(props: RequestViewerProps) {
  return (
    <div className="req-viewer">
      <Split gutterSize={1} minSize={[100,0]} snapOffset={[0,100]} className="split-h" direction="vertical">
        <RequestPanel />
        <ResponsePanel />
      </Split>
    </div>
  );
}


