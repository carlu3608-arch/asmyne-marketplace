document.addEventListener('DOMContentLoaded', function () {
  var sel = document.getElementById('langSel');
  if (sel) sel.addEventListener('change', function () { location.href = '/lang/' + sel.value; });
  var burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', function () { document.getElementById('navLinks').classList.toggle('open'); });
  var main = document.getElementById('gMain');
  document.querySelectorAll('.g-thumb').forEach(function (b) {
    b.addEventListener('click', function () {
      main.src = b.dataset.src;
      document.querySelectorAll('.g-thumb').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });
  document.querySelectorAll('form.js-confirm').forEach(function (f) {
    f.addEventListener('submit', function (e) { if (!confirm(f.dataset.msg || '?')) e.preventDefault(); });
  });
  var inp = document.getElementById('photoInput'), prev = document.getElementById('photoPreview');
  if (inp && prev) inp.addEventListener('change', function () {
    prev.innerHTML = '';
    Array.prototype.slice.call(inp.files, 0, 6).forEach(function (f) {
      var img = document.createElement('img'); img.src = URL.createObjectURL(f); prev.appendChild(img);
    });
  });
  if (window.matchMedia('(max-width:980px)').matches) {
    var fb = document.getElementById('filtersBox'); if (fb && !location.search) fb.removeAttribute('open');
  }
});
