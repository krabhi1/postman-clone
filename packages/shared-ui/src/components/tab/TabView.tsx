import React, {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { ReactChildren } from "../../others/utils";
import TabPanel, { TabPanelProps } from "./TabPanel";
import "../../styles/tab-list.css";
import CloseIcon from "../../icons/CloseIcon";
type TabViewProps = ReactChildren & {
  activeIndex?: number;
  onTabChange?: (index: number) => void;
};

export default function TabView(props: TabViewProps) {
  const [hiddenTab, setHiddenTab] = React.useState<ReactNode[]>([]);
  console.log("render TabView",props.children);

  


  const tabs = Children.toArray(props.children).filter(
    // (child): child is ReactElement<TabPanelProps> =>
    //   React.isValidElement(child) && child.type === TabPanel && child.props.closable

    (e): e is ReactElement<TabPanelProps> => {
      const child = e as ReactElement<TabPanelProps>;
      const closable = child.props.closable || false;

      for (const t of hiddenTab) {
        const tab = t as ReactElement<TabPanelProps>;
        if (tab.key === child.key) {
          return false;
        }
      }

      if (React.isValidElement(child) && child.type === TabPanel && !closable) {
        return true;
      }
      return false;
    }
  );
  const [index, setIndex] = React.useState(props.activeIndex || 0);

  // useEffect(() => {
  //   const tabState = tabs.map((tab, i) => ({
  //     closable: tab.props.closable ,
  //     index: i,
  //   }));
  //   setTabState(tabState);
  // }, [tabs]);
  function handleTabChange(index: number) {
    setIndex(index);
    props.onTabChange?.(index);
  }
  function handleCloseTab(index: number) {
    // const newTabs = tabs.filter((_, i) => i !== index);
    // const newIndex = index === tabs.length - 1 ? index - 1 : index;
    // setIndex(newIndex);
    // props.onTabChange?.(newIndex);

    // tabs[index].props.closable = true;
    setHiddenTab([...hiddenTab, tabs[index]]);
    console.log({ hiddenTab });
  }
  useEffect(() => {
    handleTabChange(props.activeIndex || 0);
  }, [props.activeIndex]);

  return (
    <div className="tab-list-context">
      <div className="tab-list">
        {tabs.map((tab, i) =>
          tab.props.headerTemplate ? (
            <Fragment key={i}>
              {tab.props.headerTemplate?.({
                onClick: () => handleTabChange(i),
                isActive: index == i,
                index: i,
              })}
            </Fragment>
          ) : (
            <div
              className={`changes ${index == i ? "active" : ""}`}
              key={i}
              onClick={() => handleTabChange(i)}
            >
              <span>{tab.props.header || `Item ${i + 1}`}</span>
              <span className="close-icon" onClick={() => handleCloseTab(i)}>
                <CloseIcon />
              </span>
            </div>
          )
        )}
      </div>
      <div>{tabs.length && tabs[index]}</div>
    </div>
  );
}

export function TabTest(props: { children?: ReactNode }) {
  console.log(Children.toArray(props.children));
  ///@ts-ignore
  window.childs = Children.toArray(props.children);
  /**
   * what i need
   * - render only active Children which is TabPanel
   * -
   *  */
  return <>Tab Test</>;
}

type TabView2Props = {
  tabs: Tab[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  onCloseTab?: (index: number) => void;
};

export type HeaderOptions = {
  onClick: () => void;
  isActive: boolean;
  index: number;
  onClose: () => void;
};
export type Tab = {
  header: (options: HeaderOptions) => ReactNode;
  content: ReactNode;
  closable?: boolean;
};

export function TabView2(props: TabView2Props) {
  const [index, setIndex] = React.useState(props.activeIndex || 0);
  const tabs = props.tabs.filter((tab) => !tab.closable);
  function handleTabChange(index: number) {
    setIndex(index);
    props.onTabChange?.(index);
  }
  // TODO: incorrect logic
  function handleCloseTab(index: number) {
    //setting next or prev active tab
    // const left = index - 1;
    // const right = index + 1;
    // console.log({ left, right, index });
    // if (left >= 0) {
    //   handleTabChange(left);
    // } else if (right < tabs.length) {
    //   handleTabChange(right);
    // }

    //next active tab index

    // handleTabChange(index);
    //next tick
    props.onCloseTab?.(index);
  }
  function RenderTab() {
    if (index >= 0 && index < tabs.length) return tabs[index].content;
    return undefined;
  }
  function RenderHeader(header: ReactNode) {
    if (React.isValidElement(header)) {
      return <Fragment>{header}</Fragment>;
    }
    return header;
  }
  return (
    <div className="tab-list-context">
      <div className="tab-list">
        {tabs.map((tab, i) => {
          // if (React.isValidElement(tab.header)) {
          // }
          return (
            <Fragment key={i}>
              {tab.header({
                onClick: () => handleTabChange(i),
                isActive: index == i,
                index: i,
                onClose: () => handleCloseTab(i),
              })}
            </Fragment>
          );
          // return (
          //   <div
          //     className={`changes ${index == i ? "active" : ""}`}
          //     key={i}
          //     onClick={() => handleTabChange(i)}
          //   >
          //     <span>{tab.header}</span>
          //     <span className="close-icon" onClick={() => handleCloseTab(i)}>
          //       <CloseIcon />
          //     </span>
          //   </div>
          // );
        })}
      </div>
      <div>
        <RenderTab />
      </div>
    </div>
  );
}
