import { HttpMethod, RequestItem } from "common-utils/types";
import Split from "react-split";
import "../../../styles/viewer.css";
import { RequestPanel } from "../panels/RequestPanel";
import { ResponsePanel } from "../panels/ResponsePanel";
import { useLiveStore } from "../../../configs/liveblocks.config";
import { useShallow } from "zustand/react/shallow";
export type RequestViewerProps = {
  id: string;
  collectionId: string;
  method: HttpMethod;
};

export default function RequestViewer({
  id,
  collectionId,
  method,
}: RequestViewerProps) {
  const { path, request } = useLiveStore(
    useShallow((state) => ({
      path: state.getItemPath(collectionId, id),
      request: state.getRequest(collectionId, id),
    }))
  );
  if (!request) return "Request not found";
  return (
    <div className="req-viewer">
      <Split
        sizes={[70, 30]}
        gutterSize={1}
        minSize={[100, 0]}
        snapOffset={[0, 100]}
        className="split-h"
        direction="vertical"
      >
        <RequestPanel
          path={path}
          request={request}
          collectionId={collectionId}
        />
        <ResponsePanel />
      </Split>
    </div>
  );
}
