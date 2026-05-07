const ensureProtocol = (href: string) => {
  if (!href) return href;
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:')) return href;
  return `https://${href}`;
};

export const normalizeRichTextHtml = (html: string) => {
  if (!html) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href') ?? '';
    anchor.setAttribute('href', ensureProtocol(href));
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });

  return doc.body.innerHTML;
};
