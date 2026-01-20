import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import mammoth from 'mammoth';
import yaml from 'js-yaml';

const postsDirectory = path.join(process.cwd(), 'posts');

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 225;
  const noOfWords = text.split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

export interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  tags: string[]; // Added tags array
  contentHtml?: string;
}

async function parseDocx(fullPath: string): Promise<{ data: Partial<PostData>; contentHtml: string }> {
  const buffer = fs.readFileSync(fullPath);
  const textResult = await mammoth.extractRawText({ buffer });
  const rawText = textResult.value
    .replace(/[\u201C\u201D]/g, '"') 
    .replace(/[\u2018\u2019]/g, "'") 
    .replace(/\u00A0/g, ' ')         
    .trim();

  const readingTime = calculateReadingTime(rawText);
  const htmlResult = await mammoth.convertToHtml({ buffer });
  let contentHtml = htmlResult.value;

  const match = rawText.match(/^---\s*([\s\S]*?)\s*---/);
  
  if (match) {
    try {
      const yamlContent = match[1];
      // FIX: Use a Record type instead of 'any'
      const data = yaml.load(yamlContent) as Record<string, unknown>;
      contentHtml = contentHtml.replace(/^[\s\S]*?---[\s\S]*?---/, '');

      // Safely handle the tags string conversion
      const rawTags = data.tags as string | undefined;
      const tags = rawTags ? rawTags.split(',').map((t) => t.trim()) : [];

      return {
        data: { 
          title: data.title as string | undefined,
          date: data.date as string | undefined,
          excerpt: data.excerpt as string | undefined,
          tags, 
          readingTime 
        },
        contentHtml
      };
    } catch (e) {
      console.error(`YAML Error in ${fullPath}:`, e);
    }
  }

  return {
    data: { 
      title: path.basename(fullPath).replace(/\.docx$/, '').replace(/-/g, ' '),
      readingTime,
      tags: [] 
    },
    contentHtml
  };
}

export async function getSortedPostsData(): Promise<PostData[]> {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.docx'))
      .map(async (fileName): Promise<PostData> => {
        const id = fileName.replace(/\.(md|docx)$/, '');
        const fullPath = path.join(postsDirectory, fileName);

        if (fileName.endsWith('.md')) {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [];
          
          return { 
            id, 
            title: (data.title as string) || id,
            date: (data.date as string) || '',
            excerpt: (data.excerpt as string) || '',
            tags,
            readingTime: calculateReadingTime(content)
          };
        }

        const { data } = await parseDocx(fullPath);
        return {
          id,
          title: data.title || id,
          date: data.date || '',
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          readingTime: data.readingTime || '1 min read'
        };
      })
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<PostData> {
  const mdPath = path.join(postsDirectory, `${id}.md`);
  const docxPath = path.join(postsDirectory, `${id}.docx`);

  if (fs.existsSync(docxPath)) {
    const { data, contentHtml } = await parseDocx(docxPath);
    return { 
      id, 
      contentHtml, 
      title: data.title || id,
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      readingTime: data.readingTime || '1 min read'
    };
  }

  const fileContents = fs.readFileSync(mdPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [];

  return {
    id,
    contentHtml: processedContent.toString(),
    title: (data.title as string) || id,
    date: (data.date as string) || '',
    excerpt: (data.excerpt as string) || '',
    tags,
    readingTime: calculateReadingTime(content)
  };
}