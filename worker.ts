type AssetsBinding = {
  fetch(input: Request | string): Promise<Response>
}

type Env = {
  ASSETS: AssetsBinding
}

function withPath(request: Request, pathname: string) {
  const url = new URL(request.url)
  url.pathname = pathname
  return new Request(url, request)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const exact = await env.ASSETS.fetch(request)
    if (exact.status !== 404) return exact

    const url = new URL(request.url)
    const cleanPath = url.pathname.replace(/\/$/, '')
    const canTryHtml = request.method === 'GET' && cleanPath && !cleanPath.includes('.')

    if (canTryHtml) {
      const html = await env.ASSETS.fetch(withPath(request, `${cleanPath}.html`))
      if (html.status !== 404) return html
    }

    return env.ASSETS.fetch(withPath(request, '/404.html'))
  },
}
