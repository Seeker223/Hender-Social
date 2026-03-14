export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return ''
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    // Server/build fallback: keep plain string.
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove dangerous elements.
  doc.querySelectorAll('script, style, iframe, object, embed').forEach((n) => n.remove())

  // Remove inline event handlers and javascript: URLs.
  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = String(attr.value || '')
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        return
      }
      // eslint-disable-next-line no-script-url
      if ((name === 'href' || name === 'src') && value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}
