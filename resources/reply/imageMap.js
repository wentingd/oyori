const imagemap = {
    type: 'imagemap',
    baseUrl: `${baseURL}/static/rich`,
    altText: 'Imagemap alt text',
    baseSize: { width: 1040, height: 1040 },
    actions: [
      { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
      { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
      { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
      { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
    ],
    video: {
      originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
      previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
      area: {
        x: 280,
        y: 385,
        width: 480,
        height: 270,
      },
      externalLink: {
        linkUri: 'https://line.me',
        label: 'LINE'
      }
    },
  }