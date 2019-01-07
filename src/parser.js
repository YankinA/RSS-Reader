export default (newsXMLData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(newsXMLData, 'application/xml');
  const items = doc.querySelectorAll('item');
  return Array.from(items).map((item) => {
    const link = item.querySelector('link');
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const linkText = link.textContent ? link.textContent : '';
    const titleText = title.textContent ? title.textContent : '';
    const descriptionText = description.textContent ? description.textContent : '';
    return { linkText, titleText, descriptionText };
  });
};
