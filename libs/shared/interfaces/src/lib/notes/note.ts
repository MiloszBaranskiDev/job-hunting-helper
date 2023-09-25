export interface Note {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderIndex: number;
  name: string;
  slug: string;
  content: string;
  groupId: string;
}
