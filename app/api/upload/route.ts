import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('image') as File;

  if (!file) return NextResponse.json({ error: 'Kein Bild' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = uuidv4() + '-' + file.name.replaceAll(' ', '_');
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filepath, buffer);
  return NextResponse.json({ url: `/uploads/${filename}` });
}