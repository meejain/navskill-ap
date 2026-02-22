/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Audemars Piguet website cleanup
 * Purpose: Remove non-content elements, navigation, footer, and site-wide widgets
 * Applies to: www.audemarspiguet.com (all templates)
 * Generated: 2026-02-21
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.audemarspiguet.com/
 * - Cleaned HTML analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation
    // Found in captured DOM: <header class="header experiencefragment">
    WebImporter.DOMUtils.remove(element, [
      'header.header',
      '.ap-header-app',
      '.header-placeholder',
    ]);

    // Remove skip-to-content accessibility link
    // Found in captured DOM: <a href="#maincontent" class="accessibility-label skip-main-link">
    WebImporter.DOMUtils.remove(element, [
      '.skip-main-link',
      '.accessibility-label',
    ]);

    // Remove AP loader overlay
    // Found in captured DOM: <div class="ap-loader-app initialized-ApLoader">
    WebImporter.DOMUtils.remove(element, [
      '.ap-loader-app',
    ]);

    // Remove swiper navigation buttons (carousel prev/next)
    // Found in captured DOM: <div class="swiper-navigation"> with prev/next buttons
    WebImporter.DOMUtils.remove(element, [
      '.swiper-navigation',
    ]);

    // Remove video play button controls
    // Found in captured DOM: <div class="ap-primaryhero__controls">
    WebImporter.DOMUtils.remove(element, [
      '.ap-primaryhero__controls',
    ]);

    // Remove lookbook play icons
    // Found in captured DOM: <div class="ap-lookbook-element__icon">
    WebImporter.DOMUtils.remove(element, [
      '.ap-lookbook-element__icon',
    ]);

    // Remove tooltip containers (empty)
    // Found in captured DOM: <div class="ap-standard-card__tooltip-container">
    WebImporter.DOMUtils.remove(element, [
      '.ap-standard-card__tooltip-container',
    ]);

    // Re-enable scrolling if body overflow is hidden
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining unwanted HTML elements
    WebImporter.DOMUtils.remove(element, [
      'source',
      'iframe',
      'link',
      'noscript',
      'video',
    ]);

    // Clean up tracking and animation attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-root');
      el.removeAttribute('data-svg-origin');
    });

    // Remove footer if present
    // Found in captured DOM: <footer> element
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer',
    ]);
  }
}
