import { useState, useEffect } from "react";
import "../styles/bread-crumb.css";

export type BreadCrumbProps = {
  path: string;
};
type BreadCrumbData = {
  path: string;
  pathName: string;
  type: "slash" | "item";
};

export default function BreadCrumb({ path }: BreadCrumbProps) {
  const [paths, setPaths] = useState<BreadCrumbData[]>([]);

  useEffect(() => {
    const data = new Array<BreadCrumbData>();

    let newPath = "/";
    for (const iterator of path.trim().split("/")) {
      if (iterator != "") {
        newPath += "/" + iterator;
        data.push({
          path: newPath,
          pathName: iterator,
          type: "item",
        });

        data.push({
          path: newPath,
          pathName: "/",
          type: "slash",
        });
      }
    }

    if (data[data.length - 1].type == "slash") data.pop();

    setPaths(data);
  }, [path]);

  return (
    <div className="bread-crumb">
      {paths.map((item, i) => {
        return item.type == "item" ? (
          <span key={i} className="path-item">
            {item.pathName}
          </span>
        ) : (
          <span key={i} className="path-slash">
            /
          </span>
        );
      })}
    </div>
  );
}
