/**
 * PDF 处理工具（基于 pdfjs-dist + pdf-lib）
 * 支持：渲染、生成、提取文字、合并、填表
 * docs: https://mozilla.github.io/pdf.js/ | https://pdf-lib.js.org/
 */

import { PDFDocument } from 'pdf-lib';

// pdfjs-dist 按需动态加载（~200KB，仅在需要时加载）
async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
  return pdfjs;
}

/** 提取 PDF 文字内容 */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const texts: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    texts.push(pageText);
  }

  return texts.join('\n\n--- 第 ' + doc.numPages + ' 页 ---\n\n');
}

/** 渲染 PDF 第一页为 Canvas */
export async function renderPdfPage(
  file: File,
  pageNum = 1,
  scale = 1.5
): Promise<HTMLCanvasElement> {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/** 生成新的 PDF 文档 */
export async function createPdf(pages: Array<{ text: string; x?: number; y?: number }>): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const p of pages) {
    const page = doc.addPage([595, 842]); // A4
    page.drawText(p.text, {
      x: p.x ?? 50,
      y: p.y ?? 800,
      size: 12,
    });
  }

  return await doc.save();
}

/** 合并多个 PDF */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  return await merged.save();
}
