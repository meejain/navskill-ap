/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-luxury block
 *
 * Source: https://www.audemarspiguet.com/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading with italic subtitle, optional description, CTA link)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="ap-primaryhero">
 *   <picture class="ap-primaryhero__background"><img src="..." alt="..."></picture>
 *   <div class="ap-primaryhero__title"><h1><span>Title</span><br><span><i>Subtitle</i></span></h1></div>
 *   <div class="ap-primaryhero__text"><div class="text"><p>Description</p></div></div>
 *   <div class="ap-primaryhero__link"><a class="ap-link" href="...">CTA</a></div>
 * </div>
 *
 * Generated: 2026-02-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  // Found in captured DOM: <picture class="ap-primaryhero__background"><img src="..." alt="">
  // Also handles video backgrounds that have a fallback image
  const bgPicture = element.querySelector('.ap-primaryhero__background img');
  const bgVideo = element.querySelector('.ap-primaryhero__background video source');
  if (bgPicture) {
    cells.push([bgPicture.cloneNode(true)]);
  }

  // Build content cell
  const contentCell = [];

  // Extract heading with title and italic subtitle
  // Found in captured DOM: <h1 class="heading-1"><span>Title</span><br><span><i>Subtitle</i></span></h1>
  const heading = element.querySelector('.ap-primaryhero__title h1, .ap-primaryhero__title h2');
  if (heading) {
    // Rebuild heading: extract text spans and italic content
    const spans = heading.querySelectorAll('.js-reveal-effect-line');
    const h1 = document.createElement('h1');
    spans.forEach((span, index) => {
      if (index > 0) h1.append(document.createElement('br'));
      const italic = span.querySelector('i');
      if (italic) {
        const em = document.createElement('em');
        em.textContent = italic.textContent.trim();
        h1.append(em);
      } else {
        h1.append(span.textContent.trim());
      }
    });
    contentCell.push(h1);
  }

  // Extract description text
  // Found in captured DOM: <div class="ap-primaryhero__text"><div class="text"><p>...</p></div></div>
  const descText = element.querySelector('.ap-primaryhero__text .text p');
  if (descText && descText.textContent.trim()) {
    contentCell.push(descText.cloneNode(true));
  }

  // Extract CTA link
  // Found in captured DOM: <div class="ap-primaryhero__link"><a class="ap-link ap-link--line" href="...">CTA</a></div>
  const ctaLink = element.querySelector('.ap-primaryhero__link a.ap-link');
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent.trim();
    contentCell.push(link);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Luxury', cells });
  element.replaceWith(block);
}
