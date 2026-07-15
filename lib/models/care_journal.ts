import type { ObjectId } from 'mongodb';

export type CareJournalDocument = {
  _id: ObjectId;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const CARE_JOURNALS_COLLECTION = 'care_journals';

export function toClientCareJournal(doc: CareJournalDocument) {
  return {
    _id: doc._id.toHexString(),
    id: doc._id.toHexString(),
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    image: doc.image,
    author: doc.author,
    readTime: doc.readTime,
    featured: doc.featured,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
