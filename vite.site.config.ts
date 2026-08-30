import { defineConfig } from 'vite'

export default defineConfig({
  root: 'site',
  publicDir: 'public',
  build: {
    outDir: '../dist/site',
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        main: 'site/index.html',
        demo: 'site/demo/index.html',
        privacy: 'site/privacy/index.html',
        terms: 'site/terms/index.html',
        notFound: 'site/404.html',
      },
    },
  },
  plugins: [
    {
      name: 'canonical-demo-preview-route',
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://preview.local').pathname
          if (pathname === '/demo/') {
            response.writeHead(302, { Location: '/demo' })
            response.end()
            return
          }
          if (pathname === '/demo') request.url = '/demo/index.html'
          next()
        })
      },
    },
  ],
})
