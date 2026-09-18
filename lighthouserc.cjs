module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local',
      url: ['http://127.0.0.1:4173/'],
      settings: { preset: 'desktop' },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
