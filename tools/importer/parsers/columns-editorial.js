/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-editorial block
 *
 * Source: https://www.audemarspiguet.com/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Single row with 2 columns, each containing: image, heading with italic subtitle, description, CTA
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="ap-dualtextimage">
 *   <div class="grid-x">
 *     <div class="cell large-6">  <!-- column 1 -->
 *       <div class="ap-textimage">
 *         <div class="ap-textimage__img"><picture><img ...></picture></div>
 *         <div class="ap-textimage__text">
 *           <h1>Title <i>Subtitle</i></h1>
 *           <p>Description</p>
 *           <div class="link"><a class="ap-link">CTA</a></div>
 *         </div>
 *       </div>
 *     </div>
 *     <div class="cell large-6">  <!-- column 2 -->
 *       ...same structure...
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the two editorial columns
  // Found in captured DOM: <div class="ap-textimage theme-dark layout-top"> inside each grid cell
  const columnElements = element.querySelectorAll('.ap-textimage.layout-top');

  const row = [];
  columnElements.forEach((col) => {
    const colContent = document.createElement('div');

    // Extract column image
    // Found in captured DOM: <div class="ap-textimage__img"><div class="ap-image"><picture><img></picture></div></div>
    const img = col.querySelector('.ap-textimage__img img');
    if (img) {
      colContent.append(img.cloneNode(true));
    }

    // Extract heading with italic subtitle
    // Found in captured DOM: <h1><span>Title</span><br><span><i>SUBTITLE</i></span></h1>
    const heading = col.querySelector('.ap-textimage__text h1, .ap-textimage__text h2');
    if (heading) {
      const spans = heading.querySelectorAll('.js-reveal-effect-line');
      const h3 = document.createElement('h3');
      spans.forEach((span, index) => {
        if (index > 0) h3.append(document.createElement('br'));
        const italic = span.querySelector('i');
        if (italic) {
          const em = document.createElement('em');
          em.textContent = italic.textContent.trim();
          h3.append(em);
        } else if (span.textContent.trim()) {
          h3.append(span.textContent.trim());
        }
      });
      if (h3.textContent.trim()) {
        colContent.append(h3);
      }
    }

    // Extract description paragraphs
    // Found in captured DOM: <p> elements directly inside .ap-textimage__text
    const paragraphs = col.querySelectorAll('.ap-textimage__text > div > p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        colContent.append(p.cloneNode(true));
      }
    });

    // Extract CTA link
    // Found in captured DOM: <div class="link"><a class="ap-link ap-link--line" href="...">CTA</a></div>
    const ctaLink = col.querySelector('.link a.ap-link');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      colContent.append(link);
    }

    row.push(colContent);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Editorial', cells });
  element.replaceWith(block);
}
