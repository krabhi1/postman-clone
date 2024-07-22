import { HttpMethod, RequestItem } from "common-utils/types";
import Split from "react-split";
import "../../../styles/viewer.css";
import { RequestPanel } from "../panels/RequestPanel";
import { ResponsePanel } from "../panels/ResponsePanel";
import { useLiveStore } from "../../../configs/liveblocks.config";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState } from "react";
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
  const { path, request, updateItem, updateRequestItem, ...state } =
    useLiveStore(
      useShallow((state) => ({
        path: state.getItemPath(collectionId, id),
        request: state.getRequest(collectionId, id),
        updateRequestItem: (item: Partial<RequestItem>) => {
          console.log("updateRequestItem", item, id);
          state.updateItem(collectionId, item, id);
        },
        updateItem: state.updateItem,
      }))
    );

  const [sizes, setSizes] = useState([70, 30]);
  if (!request) return "Request not found";
  return (
    <div className="req-viewer">
      <Split
        sizes={sizes}
        onDragEnd={(sizes) => setSizes(sizes)}
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
          onHttpMethodChange={(method) => {
            updateItem(collectionId, { method }, id);
          }}
          onUrlChange={(url) => {
            updateItem(collectionId, { url }, id);
          }}
          updateRequestItem={updateRequestItem}
        />
        <ResponsePanel />
      </Split>
    </div>
  );
}
