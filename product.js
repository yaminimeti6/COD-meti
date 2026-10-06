const params = new URLSearchParams(location.search);
const product = PRODUCTS.find(item => item.id === params.get('product')) || PRODUCTS[0];
const rupees = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const scriptURL = 'https://script.google.com/macros/s/AKfycbxyDFYECSRk6otZUyzlCvb3c300B0Kb3XSV9oSYrIKNe29MX7h52bvbFf5AMObgYR4Jgw/exec';
let selectedCourse = null;

document.title = `${product.name} · Cash on Delivery`;
document.documentElement.dataset.theme = product.theme || 'slimofast';
document.querySelector('#detail-name').textContent = product.name;
document.querySelector('.detail-eyebrow').textContent = product.detailBadge || product.badge;
const rating = document.querySelector('#detail-rating');
rating.hidden = !product.rating;
if (product.rating) {
  rating.innerHTML = '<span class="rating-stars" aria-hidden="true">★★★★★</span><strong></strong>';
  rating.querySelector('strong').textContent = product.rating;
}
document.querySelector('#usage').textContent = product.usage;
document.querySelector('#detail-how').hidden = !product.usage;
const visual = document.querySelector('#detail-visual');
visual.innerHTML = product.image
  ? `<img src="${product.image}" alt="${product.imageAlt}" onerror="this.remove();this.parentElement.insertAdjacentHTML('beforeend','<div class=&quot;visual-placeholder&quot;><span>${product.name}</span><small>PRODUCT IMAGE</small></div>')">`
  : `<div class="visual-placeholder"><span>${product.name}</span><small>PRODUCT IMAGE</small></div>`;

const picker = document.querySelector('#course-picker');
const trigger = document.querySelector('#course-trigger');
const courseMenu = document.querySelector('#course-menu');
const courseSelected = document.querySelector('#course-selected');
const courseValue = document.querySelector('#course-value');
if (product.courses.length) {
  selectedCourse = product.courses[0];
  courseMenu.innerHTML = product.courses.map((course, index) => `
    <div class="course-option" id="course-option-${course.months}" role="option" tabindex="-1" aria-selected="${index === 0}" data-months="${course.months}" data-price="${course.price}">
      <span class="course-option-duration"><strong>${String(course.months).padStart(2, '0')}</strong><small>MONTH${course.months > 1 ? 'S' : ''}</small></span>
      <span class="course-option-copy"><strong>${course.months} Month Course</strong><small>Cash on delivery</small></span>
      <span class="course-option-price">₹${rupees.format(course.price)}</span>
    </div>`).join('');
  courseMenu.querySelectorAll('.course-option').forEach(option => {
    option.addEventListener('click', () => chooseCourse(option));
    option.addEventListener('keydown', handleOptionKeydown);
  });
  updateCourseLabel();
} else {
  courseSelected.textContent = 'Course prices coming soon';
  trigger.disabled = true;
  document.querySelector('#submit-order').disabled = true;
}

function updateCourseLabel() {
  courseSelected.textContent = `${selectedCourse.months} Month Course`;
  courseValue.value = `${selectedCourse.months} Month Course - ${rupees.format(selectedCourse.price)}`;
  courseMenu.querySelectorAll('.course-option').forEach(option => {
    const isSelected = Number(option.dataset.months) === selectedCourse.months;
    option.setAttribute('aria-selected', String(isSelected));
  });
}
function setMenuOpen(isOpen, focusSelected = false) {
  courseMenu.hidden = !isOpen;
  picker.classList.toggle('is-open', isOpen);
  trigger.setAttribute('aria-expanded', String(isOpen));
  if (isOpen && focusSelected) {
    (courseMenu.querySelector('[aria-selected="true"]') || courseMenu.firstElementChild)?.focus();
  }
}
function chooseCourse(option) {
  selectedCourse = { months: Number(option.dataset.months), price: Number(option.dataset.price) };
  updateCourseLabel();
  updateOrderButton();
  setMenuOpen(false);
  trigger.focus();
}
function handleOptionKeydown(event) {
  const options = [...courseMenu.querySelectorAll('.course-option')];
  const index = options.indexOf(event.currentTarget);
  let nextIndex = index;
  if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length;
  else if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = options.length - 1;
  else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseCourse(event.currentTarget); return; }
  else if (event.key === 'Escape') { setMenuOpen(false); trigger.focus(); return; }
  else return;
  event.preventDefault();
  options[nextIndex].focus();
}
trigger.addEventListener('click', () => setMenuOpen(courseMenu.hidden, !courseMenu.hidden));
trigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); setMenuOpen(true, true); }
});
document.addEventListener('click', event => { if (!picker.contains(event.target)) setMenuOpen(false); });

function updateOrderButton() {
  const submit = document.querySelector('#submit-order');
  if (!selectedCourse) {
    submit.textContent = 'Course pricing to be added';
    submit.disabled = true;
    return;
  }
  submit.textContent = `COMPLETE ORDER - ${rupees.format(selectedCourse.price)}`;
  submit.disabled = false;
}
updateOrderButton();

document.querySelector('#order-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedCourse) return;
  const form = event.currentTarget;
  const phoneInput = form.elements.phone;
  const phone = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  phoneInput.value = phone;
  phoneInput.setCustomValidity(/^[6-9]\d{9}$/.test(phone) ? '' : 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
  if (!form.reportValidity()) return;

  const values = Object.fromEntries(new FormData(form));
  const courseName = `${selectedCourse.months} Month`;
  const price = selectedCourse.price;
  const fullAddress = [values.address, values.landmark, values.city, values.state, values.pin].map(value => String(value || '').trim()).filter(Boolean).join(', ');
  const button = document.querySelector('#submit-order');
  const buttonText = `COMPLETE ORDER - ${rupees.format(price)}`;
  button.disabled = true;
  button.textContent = 'Submitting Order...';

  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => data.ip || '')
    .catch(() => '')
    .then(userIP => {
      const url = new URL(window.location.href);
      const payload = new FormData();
      payload.append('mobile_no', phone);
      payload.append('name', String(values.name || '').trim());
      payload.append('address', String(values.address || '').trim());
      payload.append('landmark', String(values.landmark || '').trim());
      payload.append('state', String(values.state || '').trim());
      payload.append('pincode', String(values.pin || '').trim());
      payload.append('city', String(values.city || '').trim());
      payload.append('full_address', fullAddress);
      payload.append('course_name', courseName);
      payload.append('course_price', price);
      payload.append('product_name', product.name);
      payload.append('site_no', window.location.hostname || 'slimo');
      payload.append('page_url', window.location.href);
      payload.append('campId', url.searchParams.get('utm_source') || '');
      payload.append('place', url.searchParams.get('utm_medium') || '');
      payload.append('bottle', `${product.name} - ${courseName} - Rs. ${price}`);
      payload.append('AdCrevId', url.searchParams.get('utm_campaign') || '');
      payload.append('AdCrevName', url.searchParams.get('utm_content') || '');
      payload.append('FbClickId', url.searchParams.get('fbclid') || '');
      payload.append('ip_address', userIP);
      return fetch(scriptURL, { method: 'POST', body: payload });
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(text => {
      let result;
      try { result = JSON.parse(text); } catch { result = null; }
      if (!result || result.result !== 'success') throw new Error('Order submit failed');
      window.location.assign(new URL('CodLive/thankyou.html', window.location.href).href);
    })
    .catch(() => {
      button.disabled = false;
      button.textContent = buttonText;
      window.alert('Order submit failed. Please try again.');
    });
});

document.querySelector('#order-form').elements.phone.addEventListener('input', event => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 10);
  event.currentTarget.setCustomValidity('');
});
