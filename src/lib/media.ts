/**
 * 视频处理工具（基于 mediabunny）
 * 支持：裁剪、压缩、转码、提取帧
 * docs: https://github.com/Vanilagy/mediabunny
 */

// 按需动态导入，减少首屏加载
async function getMediabunny() {
  const mb = await import('mediabunny');
  return mb;
}

/** 将视频文件转为 WebM（压缩） */
export async function compressVideo(file: File, quality = 0.7): Promise<Blob> {
  const { transcode } = await getMediabunny();
  const stream = await transcode(file, { format: 'webm', quality });
  return await stream.toBlob();
}

/** 裁剪视频片段 */
export async function trimVideo(
  file: File,
  startMs: number,
  endMs: number
): Promise<Blob> {
  const { transcode } = await getMediabunny();
  const stream = await transcode(file, {
    format: 'mp4',
    trim: { start: startMs / 1000, end: endMs / 1000 },
  });
  return await stream.toBlob();
}

/** 提取视频第一帧作为封面图 */
export async function extractVideoFrame(file: File): Promise<Blob> {
  const { transcode } = await getMediabunny();
  const stream = await transcode(file, {
    format: 'webp',
    frames: 1,
  });
  return await stream.toBlob();
}
