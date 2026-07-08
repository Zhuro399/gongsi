/**
 * 图像处理工具（基于 luminajs）
 * 支持：裁剪、缩放、滤镜、格式转换
 * docs: https://www.npmjs.com/package/@gks101/luminajs
 */

import { lumina } from '@gks101/luminajs';

/** 缩放图片并返回 Blob */
export async function resizeImage(
  input: File | string,
  width: number,
  height: number
): Promise<Blob> {
  return await lumina(input).resize(width, height).toBlob();
}

/** 裁剪图片（居中裁剪） */
export async function cropImage(
  input: File | string,
  width: number,
  height: number
): Promise<Blob> {
  return await lumina(input).resize(width, height).crop('center').toBlob();
}

/** 应用滤镜（灰度） */
export async function grayscaleImage(input: File | string): Promise<Blob> {
  return await lumina(input).grayscale().toBlob();
}

/** 图片锐化 */
export async function sharpenImage(input: File | string): Promise<Blob> {
  return await lumina(input).sharpen().toBlob();
}

/** 转为 WebP 格式 */
export async function toWebP(
  input: File | string,
  quality = 0.8
): Promise<Blob> {
  return await lumina(input).toBlob('image/webp', quality);
}

/** 批量处理：缩放 + 转 WebP + 锐化 */
export async function optimizeImage(
  input: File | string,
  maxWidth = 1200
): Promise<Blob> {
  return await lumina(input)
    .resize(maxWidth, undefined as any)
    .sharpen()
    .toBlob('image/webp', 0.8);
}
