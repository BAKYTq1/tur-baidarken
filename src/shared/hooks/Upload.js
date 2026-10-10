import { adminApi } from '../../shared/api/admin';

// Как сохраняются фото:
//   'base64' — фото сжимается и кладётся прямо в поле тура строкой "data:image/jpeg;base64,…"
//   'server' — фото уходит на сервер (POST /admin/media/images → Cloudinary), в тур попадает ссылка
//
// ⚠️ 'base64' работает, только если API принимает такую строку в cover_image / gallery
// (не требует «настоящий URL»). Если при сохранении тура придёт ошибка про формат —
// верните 'server' (когда на бэкенде заработает загрузка).
export const UPLOAD_MODE = 'base64';

const BASE64_LIMITS = { maxSide: 1280, quality: 0.8, maxBytes: 350 * 1024 };
const SERVER_LIMITS = { maxSide: 1920, quality: 0.85, maxBytes: 1.5 * 1024 * 1024 };

const pickUrl = (res) => res?.url || res?.secure_url || res?.image_url || res?.path || '';

const readAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

// createImageBitmap учитывает поворот EXIF (важно для фото с телефона);
// на старых браузерах падаем обратно на <img>
async function loadImage(file) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    return { source: bitmap, w: bitmap.width, h: bitmap.height, done: () => bitmap.close?.() };
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Не удалось открыть изображение'));
      img.src = url;
    });
    return { source: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  }
}

// Сжимает до JPEG, пока не уложится в maxBytes: сначала снижает качество, потом размер
async function compress(file, { maxSide, quality, maxBytes }) {
  const img = await loadImage(file);
  try {
    let side = maxSide;
    let q = quality;
    let blob = null;

    for (let i = 0; i < 8; i += 1) {
      const scale = Math.min(1, side / Math.max(img.w, img.h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.w * scale));
      canvas.height = Math.max(1, Math.round(img.h * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; // под прозрачный PNG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img.source, 0, 0, canvas.width, canvas.height);

      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', q));
      if (blob && blob.size <= maxBytes) break;

      if (q > 0.55) q -= 0.1;
      else side = Math.round(side * 0.8);
    }
    if (!blob) throw new Error('Не удалось обработать изображение');
    return blob;
  } finally {
    img.done();
  }
}

// Выбранный файл → строка для поля тура (data-URL или ссылка)
export async function uploadPhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Выберите файл-изображение');

  if (UPLOAD_MODE === 'base64') {
    // GIF/SVG не сжимаем — берём как есть, если небольшие
    if (/gif|svg/.test(file.type)) {
      if (file.size > BASE64_LIMITS.maxBytes) throw new Error('Файл слишком большой, выберите JPG или PNG');
      return readAsDataUrl(file);
    }
    return readAsDataUrl(await compress(file, BASE64_LIMITS));
  }

  const small = file.size < 1.2 * 1024 * 1024 || /gif|svg/.test(file.type);
  const toSend = small
    ? file
    : new File([await compress(file, SERVER_LIMITS)], `${file.name.replace(/\.\w+$/, '')}.jpg`, {
        type: 'image/jpeg',
      });
  return pickUrl(await adminApi.uploadImage(toSend));
}