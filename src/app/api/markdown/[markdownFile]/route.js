// src/app/api/markdown/[markdownFile]/route.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { markdownFile } = req.params;

    if (!markdownFile) {
      return NextResponse.json({ error: 'No markdown file specified' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'app', 'markdown', `${markdownFile}.md`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Markdown file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);

    return NextResponse.json({ content, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}