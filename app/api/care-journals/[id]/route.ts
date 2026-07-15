import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { CARE_JOURNALS_COLLECTION, type CareJournalDocument, toClientCareJournal } from '@/lib/models/care_journal';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid journal ID' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);
    const journal = await collection.findOne({ _id: new ObjectId(id) });

    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
    }

    return NextResponse.json({
      journal: toClientCareJournal(journal)
    });
  } catch (err) {
    console.error('Error fetching care journal:', err);
    return NextResponse.json({ error: 'Failed to load care journal' }, { status: 500 });
  }
}
