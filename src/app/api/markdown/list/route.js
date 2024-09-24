import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

let cache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const parseSteps = (steps) => {
  return steps.map(step => {
    if (typeof step === 'string') return { text: step };
    if (typeof step === 'object') {
      const [text, substeps] = Object.entries(step)[0];
      return {
        text,
        substeps: Array.isArray(substeps) ? parseSteps(substeps) : []
      };
    }
    return { text: String(step) };
  });
};

export async function GET() {
  try {
    const now = Date.now();
    if (cache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({ practices: cache });
    }

    const markdownDir = path.join(process.cwd(), 'src', 'app', 'markdown');
    const files = await fs.readdir(markdownDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const practices = await Promise.all(markdownFiles.map(async (file) => {
      const filePath = path.join(markdownDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      if (!data.steps || !Array.isArray(data.steps)) {
        console.error(`Invalid or missing steps in file: ${file}`);
        data.steps = [];
      }

      const parsedSteps = parseSteps(data.steps);

      return {
        id: data.id || path.basename(file, '.md'),
        title: data.title,
        icon: data.icon || '✨',
        description: data.description || '',
        benefits: data.benefits || [],
        steps: parsedSteps,
        content: content.trim()
      };
    }));

    cache = practices;
    cacheTimestamp = now;

    return NextResponse.json({ practices });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}