export const convertFileToUpload = async (raw: string | File | null) => {
  if (!raw) return null;

  if (raw instanceof File) return raw;

  if (typeof raw === 'string') {
    try {
      const res = await fetch(raw);
      if (!res.ok) return null;

      const blob = await res.blob();
      const ext = (blob.type.split('/')[1] ?? 'jpg').split('+')[0];
      return new File([blob], `image.${ext}`, { type: blob.type });
    } catch (err) {
      console.error('Image URL → File error', err);
      return null;
    }
  }

  return null;
};
