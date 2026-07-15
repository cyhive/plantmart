import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { CARE_JOURNALS_COLLECTION, type CareJournalDocument, toClientCareJournal } from '@/lib/models/care_journal';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);
    const journals = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      journals: journals.map(toClientCareJournal)
    });
  } catch (err) {
    console.error('Error fetching admin care journals:', err);
    return NextResponse.json({ error: 'Failed to load care journals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, image, author, readTime, featured } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);

    const newJournal: Omit<CareJournalDocument, '_id'> = {
      title,
      excerpt: excerpt || '',
      content: content || '',
      category,
      image: image || '',
      author: author || 'Admin',
      readTime: readTime || '5 min read',
      featured: featured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newJournal as any);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString()
    });
  } catch (err) {
    console.error('Error creating care journal:', err);
    return NextResponse.json({ error: 'Failed to create care journal' }, { status: 500 });
  }
}
