import { useRequestContext } from "@components/workspace/viewer/RequestViewer";
import { ContentProps } from "../BodyTabItem";
import { useEffect, useState } from "react";
import { useLocalState, useLocalStore } from "@store/app.store";

export default function Raw(
  props: Pick<ContentProps, "body" | "option" | "reqId">
) {
  const { body, reqId } = props;
  const { updateRequestItem } = useRequestContext();

  function handleUpdate(text: string) {
    updateRequestItem((item) => {
      item.body.raw.text = text;
    });
  }

  return (
    <textarea
      onChange={(e) => handleUpdate(e.target.value)}
      value={body.raw.text}
    />
  );
}
