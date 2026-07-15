import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { CARE_JOURNALS_COLLECTION, type CareJournalDocument } from '@/lib/models/care_journal';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);
    
    const journal = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!journal) {
      return NextResponse.json({ error: 'Care journal not found' }, { status: 404 });
    }

    return NextResponse.json({
      journal: {
        id: journal._id.toHexString(),
        title: journal.title,
        excerpt: journal.excerpt,
        content: journal.content,
        category: journal.category,
        image: journal.image,
        author: journal.author,
        readTime: journal.readTime,
        featured: journal.featured
      }
    });
  } catch (err) {
    console.error('Error fetching care journal:', err);
    return NextResponse.json({ error: 'Failed to fetch care journal' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.readTime !== undefined) updateData.readTime = body.readTime;
    if (body.featured !== undefined) updateData.featured = body.featured;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Care journal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating care journal:', err);
    return NextResponse.json({ error: 'Failed to update care journal' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    const db = await getDb();
    const collection = db.collection<CareJournalDocument>(CARE_JOURNALS_COLLECTION);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Care journal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting care journal:', err);
    return NextResponse.json({ error: 'Failed to delete care journal' }, { status: 500 });
  }
}
