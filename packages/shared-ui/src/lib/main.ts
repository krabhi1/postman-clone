import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import List from "../components/List";
import "../styles/style.css"
import "../styles/editor.css"
import { nanoid } from "nanoid";
import {  } from "common-store";

import WorkspaceView from "../components/WorkspaceView";

export function randomId() {
  return nanoid() + "some";
}
export { MyButton, MyInput, List ,WorkspaceView };
