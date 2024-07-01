import { RouterProvider } from "react-router-dom";
import { router } from "./others/pageRouter";

// export default function App() {
//   return <RouterProvider router={router} />;
// }

import "./styles/style.css";
import List from "./components/List";
import TabView, { TabViewExample } from "./components/tab/TabView";

export default function App() {
  return (
    <List>
      <TabViewExample />
    </List>
  );
}
