import { Note } from './note';

export interface NotesGroup {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderIndex: number;
  name: string;
  slug: string;
  notes: Note[];
}
