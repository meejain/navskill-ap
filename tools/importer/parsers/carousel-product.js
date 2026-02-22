/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product block
 *
 * Source: https://www.audemarspiguet.com/
 * Base Block: carousel
 *
 * Block Structure (from markdown example):
 * - Each row is a slide with 2 columns: [image | title + description + CTA]
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="ap-carousel--layout-1">
 *   <div class="ap-carousel__content">
 *     <div class="ap-carousel__title"><h2>Heading <i>subtitle</i></h2></div>
 *     <div class="ap-carousel__description"><a class="ap-link">CTA</a></div>
 *   </div>
 *   <div class="ap-carousel__container">
 *     <div class="swiper-wrapper">
 *       <div class="swiper-slide">
 *         <figure class="ap-standard-card">
 *           <aside class="ap-standard-card__image"><a><img ...></a></aside>
 *           <figcaption class="ap-standard-card__content">
 *             <h4 class="ap-standard-card__title">Title</h4>
 *             <div class="ap-standard-card__desc"><p>Desc</p></div>
 *             <a class="ap-link">CTA</a>
 *           </figcaption>
 *         </figure>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-21
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract carousel slides
  // Found in captured DOM: <div class="swiper-slide"> containing <figure class="ap-standard-card">
  const slides = element.querySelectorAll('.swiper-slide .ap-standard-card');

  slides.forEach((slide) => {
    // Extract slide image
    // Found in captured DOM: <aside class="ap-standard-card__image"><a><div class="ap-image"><picture><img></picture></div></a></aside>
    const img = slide.querySelector('.ap-standard-card__image img');

    // Extract slide title
    // Found in captured DOM: <h4 class="ap-standard-card__title"><p><div class="js-reveal-effect-line">text</div></p></h4>
    const titleEl = slide.querySelector('.ap-standard-card__title');
    let titleText = '';
    if (titleEl) {
      const lines = titleEl.querySelectorAll('.js-reveal-effect-line');
      if (lines.length > 0) {
        titleText = Array.from(lines).map((l) => l.textContent.trim()).join(' ');
      } else {
        titleText = titleEl.textContent.trim();
      }
    }

    // Extract slide description
    // Found in captured DOM: <div class="ap-standard-card__desc"><p>...</p></div>
    const descEl = slide.querySelector('.ap-standard-card__desc');
    let descText = '';
    if (descEl) {
      const lines = descEl.querySelectorAll('.js-reveal-effect-line');
      if (lines.length > 0) {
        descText = Array.from(lines).map((l) => l.textContent.trim()).join(' ');
      } else {
        descText = descEl.textContent.trim();
      }
    }

    // Extract slide CTA link
    // Found in captured DOM: <a class="ap-link ap-link--line" href="...">Discover more</a>
    const ctaLink = slide.querySelector(':scope > figcaption > a.ap-link, figcaption > a.ap-link');

    // Build image column
    const imgCol = document.createElement('div');
    if (img) {
      const imgClone = img.cloneNode(true);
      imgCol.append(imgClone);
    }

    // Build content column
    const contentCol = document.createElement('div');
    if (titleText) {
      const h4 = document.createElement('h4');
      h4.textContent = titleText;
      contentCol.append(h4);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      contentCol.append(p);
    }
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      contentCol.append(link);
    }

    cells.push([imgCol, contentCol]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Product', cells });
  element.replaceWith(block);
}
