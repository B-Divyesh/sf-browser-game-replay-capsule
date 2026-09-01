import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, relative, resolve } from 'node:path'

const siteRoot = resolve('dist/site')
const config = JSON.parse(readFileSync(resolve(siteRoot, 'staticwebapp.config.json'), 'utf8'))
const port = Number.parseInt(process.env.PORT ?? '4173', 10)
const globalHeaders = config.globalHeaders ?? {}
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.tgz': 'application/gzip',
  '.woff2': 'font/woff2',
}

function fileForPath(pathname) {
  const decoded = decodeURIComponent(pathname)
  if (decoded === '/demo') return resolve(siteRoot, 'demo.html')
  if (decoded === '/') return resolve(siteRoot, 'index.html')
  const candidate = resolve(siteRoot, `.${decoded}`)
  if (relative(siteRoot, candidate).startsWith('..')) return undefined
  if (existsSync(candidate) && statSync(candidate).isDirectory()) return resolve(candidate, 'index.html')
  return candidate
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
  let file = fileForPath(pathname)
  let status = 200
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    file = resolve(siteRoot, '404.html')
    status = 404
  }
  const routeHeaders = config.routes?.find((route) => route.route === pathname)?.headers ?? {}
  const headers = {
    ...globalHeaders,
    ...routeHeaders,
    'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': pathname.startsWith('/assets/') || pathname.startsWith('/releases/')
      ? 'public, max-age=31536000, immutable'
      : 'public, must-revalidate, max-age=30',
  }
  response.writeHead(status, headers)
  createReadStream(file).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Replay Capsule static preview: http://127.0.0.1:${port}\n`)
})

const close = () => server.close(() => process.exit(0))
process.on('SIGINT', close)
process.on('SIGTERM', close)
