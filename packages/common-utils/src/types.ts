export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  picUrl?: string | undefined;
};
export type RoomPermission = "room:write" | "room:read" | "room:presence:write";

type SharedUser = {
  userId: string;
  permission: RoomPermission;
};

export type ServerWorkspace = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  roomId: string;
  sharedUsers: SharedUser[];
};

export type WorkspaceGroup = {
  self: ServerWorkspace[];
  shared: ServerWorkspace[];
};

export type Item = {
  id: string;
  createdAt: number;
};

export type Workspace = Item & {
  name: string;
  collections: Collection[];
  environments: Environment[];
  globalEnvironment: Environment;
};
export type Collection = Item & {
  name: string;
  description: string;
  items: CollectionItem[];
};

export type CollectionItemType = "request" | "folder";
export type CollectionBaseItem = Item & {
  type: CollectionItemType;
  name: string;
  description: string;
};
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type Body = {
  type: "raw" | "form-data" | "urlencoded" | "file";
  data: any;
};
export type RequestItem = CollectionBaseItem & {
  url: string;
  method: HttpMethod;
  body: Body;
  headers: { [key: string]: string };
};
export type FolderItem = CollectionBaseItem & {
  items: CollectionItem[];
};

export type CollectionItem = RequestItem | FolderItem;

//-------environment-------

export type Environment = Item & {
  name: string;
  variables: EnvironmentVariable[];
};
export type EnvironmentVariable = Omit<Item, "createdAt"> & {
  key: string;
  value: string;
}; 
