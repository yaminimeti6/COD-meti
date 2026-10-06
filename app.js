const rupees = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const productRoot = document.querySelector('#products');

productRoot.innerHTML = PRODUCTS.map((product, index) => `
  <a class="product-card" data-theme="${product.theme}" href="product.html?product=${encodeURIComponent(product.id)}">
    <div class="product-visual">
      ${product.image ? `<img src="${product.image}" alt="${product.imageAlt}" onerror="this.remove();this.parentElement.insertAdjacentHTML('beforeend','<div class=&quot;visual-placeholder&quot;><span>${product.name}</span><small>PRODUCT IMAGE</small></div>')">` : `<div class="visual-placeholder"><span>${product.name}</span><small>PRODUCT IMAGE</small></div>`}
    </div>
    <div class="product-info">
      <span class="pill">${product.badge}</span>
      <div class="product-name">${product.name}</div>
      <div class="product-price-row"><strong>₹${rupees.format(Math.min(...product.courses.map(course => course.price)))}</strong><span>from ${Math.min(...product.courses.map(course => course.months))} month course</span></div>
      ${product.rating ? `<div class="product-rating"><span aria-hidden="true">★★★★☆</span><small>${product.rating}</small></div>` : `<div class="product-rating product-rating-note"><small>${product.subtitle}</small></div>`}
    </div>
    <div class="product-buy"><span>＋</span> BUY NOW</div>
  </a>`).join('');
