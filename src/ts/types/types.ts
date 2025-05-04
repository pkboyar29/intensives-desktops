export type childEntitiesMeta = {
  label: string;
  type: string;
};

export type AdminBreadcrumb = {
  entityId?: number | string;
  entityName: string;
  label?: string;
  urlPath?: string;
};

type ParentField = {
  id: number | string;
  name: string;
  grandparentId?: number | string;
};

export type EntityShort = {
  id: number | string;
  name: string;
};

export type ParentFields = Record<string, ParentField>;
