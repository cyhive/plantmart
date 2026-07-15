import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { CARE_JOURNALS_COLLECTION, type CareJournalDocument, toClientCareJournal } from '@/lib/models/care_journal';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const category = searchParams.get('category');

    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);

    const query: any = {};
    if (featuredOnly) query.featured = true;
    if (category && category !== 'all') query.category = category;

    const journals = await collection.find(query).sort({ createdAt: -1 }).limit(limit).toArray();

    return NextResponse.json({
      journals: journals.map(toClientCareJournal)
    });
  } catch (err) {
    console.error('Error fetching care journals:', err);
    return NextResponse.json({ error: 'Failed to load care journals' }, { status: 500 });
  }
}
