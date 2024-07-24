import {
  CollectionItem,
  HttpMethod,
  RequestItem,
} from "common-utils/types";
import BreadCrumb from "@components/BreadCrumb";
import { RequestInputBox } from "./RequestInputBox";
import { RequestTabView } from "./RequestTabView";
export type RequestPanelProps = {
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
        onHttpMethodChange={props.onHttpMethodChange}
        collectionId={collectionId}
        request={request}
      />
      {/* request tab */}
      <RequestTabView request={request} onUrlChange={props.onUrlChange} />
      {/* query tab */}
    </div>
  );
}
