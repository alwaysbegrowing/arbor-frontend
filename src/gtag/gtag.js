export const pageview = (url, title) => {
  window.gtag('config', 'G-MLX1MK30E8', {
    page_location: url,
    page_title: title,
  })
}

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
