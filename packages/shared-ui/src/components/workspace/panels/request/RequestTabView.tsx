import TabItem from "@components/tab/TabItem";
import TabView from "@components/tab/TabView";
import { useRequestContext } from "@components/workspace/viewer/RequestViewer";
import { RequestPanelProps } from "./RequestPanel";
import { BodyTabItem } from "./tabs/body/BodyTabItem";
import { ParamsTabItem } from "./tabs/ParamsTabItem";

export function RequestTabView(
  props: Pick<RequestPanelProps, "request" | "onUrlChange">
) {
  const { updateRequestItem } = useRequestContext();
  return (
    <div className="req-tab">
      <TabView>
        <TabItem header="Params">
          <ParamsTabItem
            request={props.request}
            onUrlChange={props.onUrlChange}
          />
        </TabItem>
        <TabItem header="Authorization">Authorization</TabItem>
        <TabItem header="Headers">Headers</TabItem>
        <TabItem header="Body">
          <BodyTabItem reqId={props.request.id} body={props.request.body} />
        </TabItem>
      </TabView>
    </div>
  );
}
