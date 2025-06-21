// 1. PASANG TEMA SAAT AWAL (dark/light langsung aktif sebelum DOMContentLoaded)
(function(){
  const theme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', theme);
})();

// 2. NAVBAR & FOOTER INCLUDE
document.addEventListener('DOMContentLoaded', () => {
  // Navbar
  fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
      setupDarkMode(); // Pastikan tombol sudah ada di DOM
    });

  // Footer
  fetch('components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });

  // Projects
  if(document.getElementById('projects-row')) {
    fetch('projects.json')
      .then(res => res.json())
      .then(projects => {
        renderProjects(projects);
        setupFilter(projects);
      });
  }
});

// 3. DARK MODE LOGIC
function setupDarkMode() {
  const toggle = document.getElementById('darkToggle');
  const iconLight = document.getElementById('icon-light');
  const iconDark = document.getElementById('icon-dark');
  let theme = document.body.getAttribute('data-theme') || 'light';
  updateIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = (theme === 'light') ? 'dark' : 'light';
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateIcon(theme);
    });
  }

  function updateIcon(t) {
    if (iconLight && iconDark) {
      if (t === 'dark') {
        iconLight.style.display = "none";
        iconDark.style.display = "";
      } else {
        iconLight.style.display = "";
        iconDark.style.display = "none";
      }
    }
  }
}

// 4. FILTER PROJECT
function setupFilter(projects) {
  const filterBtns = document.querySelectorAll('.btn-category');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const category = btn.getAttribute('data-category');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(
        category === 'All' ? projects : projects.filter(p => p.category === category)
      );
      if (window.AOS) AOS.refresh();
    });
  });
}

// 5. RENDER PROJECT
function renderProjects(projects) {
  const row = document.getElementById('projects-row');
  if(!row) return;
  row.innerHTML = '';
  projects.forEach(p => {
    row.innerHTML += `
      <div class="col-md-6 col-lg-4" data-aos="fade-up">
        <div class="card project-card h-100 shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.title}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${p.title}</h5>
            <span class="badge bg-secondary mb-2">${p.category}</span>
            <p class="card-text">${p.description}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <a href="${p.demo}" class="btn btn-outline-primary btn-sm" target="_blank">Demo</a>
            <a href="${p.source}" class="btn btn-outline-secondary btn-sm" target="_blank">Source</a>
          </div>
        </div>
      </div>
    `;
  });
}
