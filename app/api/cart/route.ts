import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getCartForUser, saveCartForUser } from '@/lib/cart/server';
import { cartPutBodySchema } from '@/lib/validators/cart';
import { normalizeCartProductId } from '@/lib/cart/product-id';

export async function GET() {
  try {
    const { session, response } = await requireSession();
    if (response) return response;

    const items = await getCartForUser(session!.sub);
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { session, response } = await requireSession();
    if (response) return response;

    const json = await req.json();
    const parsed = cartPutBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const items = parsed.data.items.map((item) => ({
      ...item,
      id: normalizeCartProductId(item.id),
    }));

    const saved = await saveCartForUser(session!.sub, items);
    return NextResponse.json({ items: saved });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
  }
}
