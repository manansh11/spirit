import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

const parseSteps = (steps) => {
  return steps.map(step => {
    if (typeof step === 'string') return { text: step };
    if (typeof step === 'object') {
      const [text, substeps] = Object.entries(step)[0];
      return {
        text,
        substeps: Array.isArray(substeps) ? parseSteps(substeps.map(s => `- ${s}`)) : []
      };
    }
    return { text: String(step) };
  });
};

export async function GET() {
  try {
    const markdownDir = path.join(process.cwd(), 'src', 'app', 'markdown');
    const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));

    const practices = files.map(file => {
      const filePath = path.join(markdownDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let { data, content } = matter(fileContent);

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
    });

    return NextResponse.json({ practices });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}