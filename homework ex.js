const form = document.getElementById('regForm');
const status = document.getElementById('status');
const success = document.getElementById('success');
const fields = Array.from(form.querySelectorAll('input'));
 
const validators = {
  name(v) {
    v = v.trim();
    if (!v) return 'Введите имя';
    if (v.length < 2) return 'Имя должно содержать минимум 2 символа';
    return '';
  },
  email(v) {
    v = v.trim();
    if (!v) return 'Введите email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Некорректный формат email';
    return '';
  },
  password(v) {
    if (!v) return 'Введите пароль';
    if (v.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (!/[A-Za-zА-Яа-яЁё]/.test(v) || !/\d/.test(v)) return 'Пароль должен содержать буквы и цифры';
    return '';
  },
  confirmPassword(v) {
    if (!v) return 'Подтвердите пароль';
    if (v !== form.password.value) return 'Пароли не совпадают';
    return '';
  }
};
 
function errorOf(input) {
  return form.querySelector(`[data-error-for="${input.name}"]`);
}
 
function showError(input, message) {
  const el = errorOf(input);
  el.textContent = message;
  el.style.color = 'red';
  input.style.border = message ? '2px solid red' : (input.value ? '2px solid green' : '');
}
 
function validateField(input) {
  const message = validators[input.name](input.value);
  showError(input, message);
  return !message;
}
 
function updateStatus() {
  const filled = fields.filter(i => i.value.trim() !== '').length;
  const valid = fields.filter(i => !validators[i.name](i.value)).length;
  status.textContent = `Заполнено полей: ${filled} из ${fields.length}. Корректных: ${valid}.`;
}
 
fields.forEach(input => {
  input.addEventListener('focus', () => {
    input.style.backgroundColor = '#ffffcc';
  });
 
  input.addEventListener('blur', () => {
    input.style.backgroundColor = '';
    validateField(input);
  });
 
  input.addEventListener('input', () => {
    success.textContent = '';
    updateStatus();
    if (errorOf(input).textContent) validateField(input);
    if (input.name === 'password' && form.confirmPassword.value) validateField(form.confirmPassword);
  });
});
 
form.addEventListener('submit', event => {
  event.preventDefault(); 
 
  const results = fields.map(validateField);
  if (results.every(Boolean)) {
    success.textContent = 'Форма заполнена корректно. Регистрация успешна!';
    console.log({ name: form.name.value.trim(), email: form.email.value.trim() });
  } else {
    success.textContent = '';
    fields[results.indexOf(false)].focus(); 
  }
});