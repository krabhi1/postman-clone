import { RouterProvider } from "react-router-dom";
import { router } from "./others/pageRouter";
import "./styles/style.css";
import { RadioGroupExample } from "./components/RadioGroup";
import { DropdownExample } from "./components/Dropdown";

export default function App() {
  return <RouterProvider router={router} />;
  // return <DropdownExample/>
  // return <RadioGroupExample/>
}

// import List from "./components/List";
// import TabView, { TabViewExample } from "./components/tab/TabView";
// import { SidebarExample } from "./components/sidebar/Sidebar";
// import { SplitterExample } from "./components/Splitter";

// export default function App() {
//   return (
//     <List>
//       <TabViewExample />
//       <SidebarExample />
//       <SplitterExample/>
//     </List>
//   );
// }
