import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getAddressesCollection } from '@/lib/addresses/collection';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const col = await getAddressesCollection();
    const userId = new ObjectId(session.sub);
    const addressId = new ObjectId(id);

    // If setting as default, unset others first
    if (body.isDefault) {
      await col.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const updateData: any = { updatedAt: new Date() };
    if (body.type !== undefined) updateData.type = body.type;
    if (body.street !== undefined) updateData.street = body.street;
    if (body.building !== undefined) updateData.building = body.building;
    if (body.landmark !== undefined) updateData.landmark = body.landmark;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;
    if (body.deliveryInstructions !== undefined) updateData.deliveryInstructions = body.deliveryInstructions;
    if (body.alternatePhone !== undefined) updateData.alternatePhone = body.alternatePhone;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.coordinates !== undefined) updateData.coordinates = body.coordinates;

    const result = await col.updateOne(
      { _id: addressId, userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating address:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const col = await getAddressesCollection();
    const userId = new ObjectId(session.sub);
    const addressId = new ObjectId(id);

    // Find the address to see if it was the default
    const addressToDelete = await col.findOne({ _id: addressId, userId });
    
    if (!addressToDelete) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await col.deleteOne({ _id: addressId, userId });

    // If it was default, make the most recently added address default
    if (addressToDelete.isDefault) {
      const nextAddress = await col.findOne({ userId }, { sort: { createdAt: -1 } });
      if (nextAddress) {
        await col.updateOne({ _id: nextAddress._id }, { $set: { isDefault: true } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting address:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
