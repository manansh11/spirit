import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const markdownFile = searchParams.get('markdownFile');

    if (!markdownFile) {
      return NextResponse.json({ error: 'No markdown file specified' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'app', 'markdown', markdownFile); // Adjusted path
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Markdown file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
