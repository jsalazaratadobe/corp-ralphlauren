export default function decorate(block) {
  // Find video URL from first row (link to .mp4)
  const firstRow = block.querySelector(':scope > div:first-child');
  const link = firstRow?.querySelector('a[href]');
  const videoSrc = link?.href || '';

  if (videoSrc && videoSrc.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    // Create video element
    const video = document.createElement('video');
    video.className = 'hero-video-bg';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');

    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = `video/${videoSrc.match(/\.(mp4|webm|ogg)/i)[1]}`;
    video.append(source);

    // Replace the first row content with the video
    firstRow.textContent = '';
    firstRow.append(video);
    firstRow.classList.add('hero-video-media');
  }

  // Optimize any images in the text row (e.g. signature)
  block.querySelectorAll('img').forEach((img) => {
    if (!img.src || img.src.startsWith('data:')) return;
    // Skip optimization for inline data URIs
  });
}
