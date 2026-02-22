/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media block
 *
 * Source: https://www.audemarspiguet.com/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Single row with 2 columns, each containing one image
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="ap-lookbook-basic ap-lookbook--D">
 *   <div class="lookbookElement image ap-lookbook__element-wrapper--square1">
 *     <div class="ap-lookbook-element">
 *       <button class="ap-lookbook-element__video">
 *         <img alt="..." src="...">
 *       </button>
 *     </div>
 *   </div>
 *   <div class="lookbookElement image ap-lookbook__element-wrapper--square2">
 *     <div class="ap-lookbook-element">
 *       <div class="ap-lookbook-element__image">
 *         <img alt="..." src="...">
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract lookbook image elements
  // Found in captured DOM: <div class="lookbookElement image"> containing images
  const imageWrappers = element.querySelectorAll('.lookbookElement');

  const row = [];
  imageWrappers.forEach((wrapper) => {
    // Images can be inside button (video thumbnail) or div (static image)
    // Found in captured DOM:
    //   - <button class="ap-lookbook-element__video"><img ...>
    //   - <div class="ap-lookbook-element__image"><img ...>
    const img = wrapper.querySelector('.ap-lookbook-element__video img, .ap-lookbook-element__image img, .ap-lookbook-element img');
    if (img) {
      const col = document.createElement('div');
      col.append(img.cloneNode(true));
      row.push(col);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Media', cells });
  element.replaceWith(block);
}
