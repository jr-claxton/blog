import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import mammoth from 'mammoth';
import yaml from 'js-yaml';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  contentHtml?: string;
}

async function parseDocx(fullPath: string): Promise<{ data: Partial<PostData>; contentHtml: string }> {
  const buffer = fs.readFileSync(fullPath);
  
  // Extract text and sanitize Word's "smart" characters and hidden formatting
  const textResult = await mammoth.extractRawText({ buffer });
  const rawText = textResult.value
    .replace(/[\u201C\u201D]/g, '"') // Curly double quotes
    .replace(/[\u2018\u2019]/g, "'") // Curly single quotes
    .replace(/\u00A0/g, ' ')         // Hidden non-breaking spaces
    .trim();

  const htmlResult = await mammoth.convertToHtml({ buffer });
  let contentHtml = htmlResult.value;

  // Regex to find content between --- blocks
  const match = rawText.match(/^---\s*([\s\S]*?)\s*---/);
  
  if (match) {
    try {
      const yamlContent = match[1];
      // Use js-yaml directly to avoid gray-matter's engine detection errors
      const data = yaml.load(yamlContent) as Partial<PostData>;
      
      // Remove the metadata block from the HTML so it doesn't show in the body
      contentHtml = contentHtml.replace(/^[\s\S]*?---[\s\S]*?---/, '');

      return {
        data: data || {},
        contentHtml
      };
    } catch (e) {
      console.error(`YAML Error in ${fullPath}:`, e);
    }
  }

  return {
    data: { title: path.basename(fullPath).replace(/\.docx$/, '').replace(/-/g, ' ') },
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
          const { data } = matter(fileContents);
          return { 
            id, 
            title: (data.title as string) || id,
            date: (data.date as string) || '',
            excerpt: (data.excerpt as string) || ''
          };
        }

        const { data } = await parseDocx(fullPath);
        return {
          id,
          title: data.title || id,
          date: data.date || '',
          excerpt: data.excerpt || ''
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
      excerpt: data.excerpt || ''
    };
  }

  const fileContents = fs.readFileSync(mdPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    id,
    contentHtml: processedContent.toString(),
    title: (data.title as string) || id,
    date: (data.date as string) || '',
    excerpt: (data.excerpt as string) || ''
  };
}