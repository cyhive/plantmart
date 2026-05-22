import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getAddressesCollection } from '@/lib/addresses/collection';
import { toPublicAddress } from '@/lib/models/address';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const col = await getAddressesCollection();
    const cursor = col.find({ userId: new ObjectId(session.sub) }).sort({ createdAt: -1 });
    const docs = await cursor.toArray();

    return NextResponse.json({ addresses: docs.map(toPublicAddress) });
  } catch (err) {
    console.error('Error fetching addresses:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const col = await getAddressesCollection();
    const userId = new ObjectId(session.sub);
    const now = new Date();
    
    // Check if the body is an array of addresses
    const isMultiple = Array.isArray(body);
    const addressDataList = isMultiple ? body : [body];

    // Basic validation for all addresses
    for (const data of addressDataList) {
      if (!data.type || !data.street || !data.city || !data.state || !data.zipCode) {
        return NextResponse.json({ error: 'Missing required address fields in one or more addresses' }, { status: 400 });
      }
    }

    // Check if any of the incoming addresses is set as default
    const hasDefault = addressDataList.some(addr => addr.isDefault);
    if (hasDefault) {
      await col.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const validTypes = ['home', 'work', 'other'];
    const newAddresses = [];

    for (let i = 0; i < addressDataList.length; i++) {
      const data = addressDataList[i];
      // If this is the user's first address overall and no default is set, make the very first one default automatically
      const count = await col.countDocuments({ userId });
      const finalIsDefault = count === 0 && i === 0 && !hasDefault ? true 
        : hasDefault && !data.isDefault ? false 
        : count === 0 && i > 0 && !hasDefault ? false 
        : Boolean(data.isDefault);

      newAddresses.push({
        userId,
        type: data.type.trim(),
        phone: data.phone?.trim() || '',
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        zipCode: data.zipCode.trim(),
        country: data.country?.trim() || 'India',
        ...(data.building?.trim() ? { building: data.building.trim() } : {}),
        ...(data.landmark?.trim() ? { landmark: data.landmark.trim() } : {}),
        ...(data.deliveryInstructions?.trim() ? { deliveryInstructions: data.deliveryInstructions.trim() } : {}),
        ...(data.alternatePhone?.trim() ? { alternatePhone: data.alternatePhone.trim() } : {}),
        ...(data.coordinates?.lat !== undefined && data.coordinates?.lng !== undefined ? { 
          coordinates: { lat: Number(data.coordinates.lat), lng: Number(data.coordinates.lng) } 
        } : {}),
        isDefault: finalIsDefault,
        createdAt: now,
        updatedAt: now,
      });
    }

    const { insertedIds } = await col.insertMany(newAddresses as any);
    const savedAddresses = await col.find({ _id: { $in: Object.values(insertedIds) } }).toArray();

    if (!savedAddresses.length) {
      return NextResponse.json({ error: 'Failed to save addresses' }, { status: 500 });
    }

    if (isMultiple) {
      return NextResponse.json({ addresses: savedAddresses.map(toPublicAddress) }, { status: 201 });
    } else {
      return NextResponse.json({ address: toPublicAddress(savedAddresses[0]) }, { status: 201 });
    }
  } catch (err) {
    console.error('Error adding address:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
