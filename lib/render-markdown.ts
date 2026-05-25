import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdownHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypePrettyCode, {
      theme: { dark: 'night-owl', light: 'github-light' },
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  // Boost muted comment colors for readability
  // night-owl dark comments: #637777 → #8BB8B8
  // github-light comments:   #6A737D → #4A555E
  return String(result)
    .replace(/--shiki-dark:#637777/g, '--shiki-dark:#8BB8B8')
    .replace(/--shiki-light:#6A737D/g, '--shiki-light:#4A555E')
}
