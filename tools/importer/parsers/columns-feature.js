/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature block
 *
 * Source: https://www.audemarspiguet.com/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Single row with 2 columns: [image | heading + description + CTA]
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="ap-text-image-component">
 *   <div class="ap-textimage">
 *     <div class="ap-textimage__img"><picture><img ...></picture></div>
 *     <div class="ap-textimage__text">
 *       <h1>Title <i>Subtitle</i></h1>
 *       <p>Description</p>
 *       <div class="link"><a class="ap-link">CTA</a></div>
 *     </div>
 *   </div>
 * </div>
 *
 * Note: On the AP homepage, the textimage block for "Find a Boutique" uses
 * a slightly different structure with image left and text right.
 *
 * Generated: 2026-02-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract image column
  // Found in captured DOM: <div class="ap-textimage__img"><div class="ap-image"><picture><img></picture></div></div>
  const img = element.querySelector('.ap-textimage__img img, .ap-textimage img');
  const imgCol = document.createElement('div');
  if (img) {
    imgCol.append(img.cloneNode(true));
  }

  // Build text column
  const textCol = document.createElement('div');

  // Extract heading with italic subtitle
  // Found in captured DOM: <h2><div class="js-reveal-effect-line"><span>Title</span></div>...</h2>
  // Note: heading has nested .js-reveal-effect-line (div > span), so select only direct children
  const heading = element.querySelector('.ap-textimage__text h1, .ap-textimage__text h2');
  if (heading) {
    const spans = heading.querySelectorAll(':scope > .js-reveal-effect-line');
    const h3 = document.createElement('h3');
    spans.forEach((span, index) => {
      if (index > 0) h3.append(document.createElement('br'));
      const italic = span.querySelector('i');
      if (italic && italic.textContent.trim()) {
        const em = document.createElement('em');
        em.textContent = italic.textContent.trim();
        h3.append(em);
      } else if (span.textContent.trim()) {
        h3.append(span.textContent.trim());
      }
    });
    if (h3.textContent.trim()) {
      textCol.append(h3);
    }
  }

  // Extract description
  // Found in captured DOM: <p> elements in .ap-textimage__text
  const paragraphs = element.querySelectorAll('.ap-textimage__text > div > p, .ap-textimage__text p');
  const seenText = new Set();
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text && !seenText.has(text)) {
      seenText.add(text);
      textCol.append(p.cloneNode(true));
    }
  });

  // Extract CTA link
  // Found in captured DOM: <div class="link"><a class="ap-link ap-link--line" href="...">CTA</a></div>
  const ctaLink = element.querySelector('.link a.ap-link, a.ap-link');
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent.trim();
    textCol.append(link);
  }

  cells.push([imgCol, textCol]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Feature', cells });
  element.replaceWith(block);
}
