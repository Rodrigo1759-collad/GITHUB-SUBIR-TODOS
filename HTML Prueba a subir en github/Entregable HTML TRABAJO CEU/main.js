// Funciones generales para modales
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
    }
  }
  
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });
  
  // Cerrar modal con tecla Escape
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });
  
  
  /* ============================
    FUNCIONES PARA ALUMNOS
  ============================ */
  function initAlumnos() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const tableBody = document.querySelector('.data-table tbody');
    const addBtn = document.querySelector('.btn-add');
    const modalId = 'modal-alumno';
  
    let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [
      {id:'001', nombre:'Laura', apellidos:'Méndez', codigo:'A001', direccion:'Calle Falsa 123', telefono:'600123456'},
      {id:'002', nombre:'Carlos', apellidos:'Ruiz', codigo:'A002', direccion:'Av. Siempre Viva 742', telefono:'600654321'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777;">No se encontraron alumnos.</td></tr>`;
        return;
      }
      data.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.apellidos}</td>
          <td>${a.codigo}</td>
          <td>${a.direccion}</td>
          <td>${a.telefono}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar alumno">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar alumno">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveAlumnos() {
      localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = alumnos.filter(a =>
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.codigo.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillAlumnoForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillAlumnoForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['nombre'].value = data.nombre || '';
      form.elements['apellidos'].value = data.apellidos || '';
      form.elements['codigo'].value = data.codigo || '';
      form.elements['direccion'].value = data.direccion || '';
      form.elements['telefono'].value = data.telefono || '';
      titleModal.textContent = data.id ? `Editar Alumno ID ${data.id}` : 'Nuevo Alumno';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const nombre = form.elements['nombre'].value.trim();
      const apellidos = form.elements['apellidos'].value.trim();
      const codigo = form.elements['codigo'].value.trim();
      const direccion = form.elements['direccion'].value.trim();
      const telefono = form.elements['telefono'].value.trim();
  
      if (!nombre || !apellidos || !codigo) {
        alert('Por favor, complete los campos obligatorios (nombre, apellidos, código).');
        return;
      }
  
      if (id) {
        // Editar alumno existente
        const idx = alumnos.findIndex(a => a.id === id);
        if (idx !== -1) {
          alumnos[idx] = { id, nombre, apellidos, codigo, direccion, telefono };
        }
      } else {
        // Nuevo alumno
        const newId = (alumnos.length ? (parseInt(alumnos[alumnos.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        alumnos.push({ id: newId, nombre, apellidos, codigo, direccion, telefono });
      }
      saveAlumnos();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const alumno = alumnos.find(a => a.id === id);
        if (alumno) {
          openModal(modalId);
          fillAlumnoForm(alumno);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este alumno?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          alumnos = alumnos.filter(a => a.id !== id);
          saveAlumnos();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    FUNCIONES PARA CURSOS
  ============================ */
  function initCursos() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const tableBody = document.querySelector('.data-table tbody');
    const addBtn = document.querySelector('.btn-add');
    const modalId = 'modal-curso';
  
    let cursos = JSON.parse(localStorage.getItem('cursos')) || [
      {id:'001', nombre:'DAW', descripcion:'Desarrollo de Aplicaciones Web'},
      {id:'002', nombre:'DAM', descripcion:'Desarrollo de Aplicaciones Multiplataforma'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#777;">No se encontraron cursos.</td></tr>`;
        return;
      }
      data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.nombre}</td>
          <td>${c.descripcion}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar curso">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar curso">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveCursos() {
      localStorage.setItem('cursos', JSON.stringify(cursos));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = cursos.filter(c =>
        c.nombre.toLowerCase().includes(term) ||
        c.descripcion.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillCursoForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillCursoForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['nombre'].value = data.nombre || '';
      form.elements['descripcion'].value = data.descripcion || '';
      titleModal.textContent = data.id ? `Editar Curso ID ${data.id}` : 'Nuevo Curso';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const nombre = form.elements['nombre'].value.trim();
      const descripcion = form.elements['descripcion'].value.trim();
  
      if (!nombre) {
        alert('Por favor, complete el nombre del curso.');
        return;
      }
  
      if (id) {
        const idx = cursos.findIndex(c => c.id === id);
        if (idx !== -1) {
          cursos[idx] = { id, nombre, descripcion };
        }
      } else {
        const newId = (cursos.length ? (parseInt(cursos[cursos.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        cursos.push({ id: newId, nombre, descripcion });
      }
      saveCursos();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const curso = cursos.find(c => c.id === id);
        if (curso) {
          openModal(modalId);
          fillCursoForm(curso);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este curso?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          cursos = cursos.filter(c => c.id !== id);
          saveCursos();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    FUNCIONES PARA CALIFICACIONES
  ============================ */
  function initCalificaciones() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const tableBody = document.querySelector('.data-table tbody');
    const addBtn = document.querySelector('.btn-add');
    const modalId = 'modal-calificacion';
  
    let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [
      {id:'001', alumnoId:'001', alumnoNombre:'Laura Méndez', curso:'DAW', asignatura:'Entornos de Desarrollo', nota:9.0},
      {id:'002', alumnoId:'002', alumnoNombre:'Carlos Ruiz', curso:'DAM', asignatura:'Programación', nota:7.5}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777;">No se encontraron calificaciones.</td></tr>`;
        return;
      }
      data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.alumnoNombre}</td>
          <td>${c.curso}</td>
          <td>${c.asignatura}</td>
          <td>${c.nota.toFixed(1)}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar calificación">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar calificación">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveCalificaciones() {
      localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = calificaciones.filter(c =>
        c.alumnoNombre.toLowerCase().includes(term) ||
        c.curso.toLowerCase().includes(term) ||
        c.asignatura.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillCalificacionForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillCalificacionForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['alumno'].value = data.alumnoId || '';
      form.elements['curso'].value = data.curso || 'DAW';
      form.elements['asignatura'].value = data.asignatura || '';
      form.elements['nota'].value = data.nota != null ? data.nota : '';
      titleModal.textContent = data.id ? `Editar Calificación ID ${data.id}` : 'Nueva Calificación';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    // Para seleccionar alumno, traemos la lista desde localStorage para mostrar nombre y id
    function getAlumnosOptions() {
      const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      return alumnos.map(a => `<option value="${a.id}">${a.nombre} ${a.apellidos}</option>`).join('');
    }
  
    // Rellenar select alumno dinámicamente en el modal
    const alumnoSelect = form.elements['alumno'];
    alumnoSelect.innerHTML = getAlumnosOptions();
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const alumnoId = form.elements['alumno'].value;
      const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      const alumnoObj = alumnos.find(a => a.id === alumnoId);
      const alumnoNombre = alumnoObj ? `${alumnoObj.nombre} ${alumnoObj.apellidos}` : '';
      const curso = form.elements['curso'].value.trim();
      const asignatura = form.elements['asignatura'].value.trim();
      const nota = parseFloat(form.elements['nota'].value);
  
      if (!alumnoId || !curso || !asignatura || isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, complete todos los campos correctamente y la nota debe estar entre 0 y 10.');
        return;
      }
  
      if (id) {
        const idx = calificaciones.findIndex(c => c.id === id);
        if (idx !== -1) {
          calificaciones[idx] = { id, alumnoId, alumnoNombre, curso, asignatura, nota };
        }
      } else {
        const newId = (calificaciones.length ? (parseInt(calificaciones[calificaciones.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        calificaciones.push({ id: newId, alumnoId, alumnoNombre, curso, asignatura, nota });
      }
      saveCalificaciones();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const calif = calificaciones.find(c => c.id === id);
        if (calif) {
          openModal(modalId);
          fillCalificacionForm(calif);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar esta calificación?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          calificaciones = calificaciones.filter(c => c.id !== id);
          saveCalificaciones();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    FUNCIONES PARA DASHBOARD
  ============================ */
  function initDashboard() {
    // Por ahora, mostramos estadísticas básicas
    const contAlumnos = document.getElementById('count-alumnos');
    const contCursos = document.getElementById('count-cursos');
    const contCalificaciones = document.getElementById('count-calificaciones');
  
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
  
    if (contAlumnos) contAlumnos.textContent = alumnos.length;
    if (contCursos) contCursos.textContent = cursos.length;
    if (contCalificaciones) contCalificaciones.textContent = calificaciones.length;
  
    // Aquí se podrían agregar gráficos o más estadísticas si quieres.
  }
  
  
  /* ============================
    FUNCIONES PARA ADMIN
  ============================ */
  function initAdmin() {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const tableBody = document.querySelector('.data-table tbody');
    const addBtn = document.querySelector('.btn-add');
    const modalId = 'modal-admin';
  
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
      {id:'001', username:'admin', role:'Administrador'},
      {id:'002', username:'user1', role:'Usuario'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#777;">No se encontraron usuarios.</td></tr>';
        return;
      }
      data.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.id}</td>
          <td>${u.username}</td>
          <td>${u.role}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar usuario">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar usuario">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveUsuarios() {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = usuarios.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillUserForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillUserForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['username'].value = data.username || '';
      form.elements['role'].value = data.role || 'Usuario';
      titleModal.textContent = data.id ? `Editar Usuario ID ${data.id}` : 'Nuevo Usuario';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const username = form.elements['username'].value.trim();
      const role = form.elements['role'].value;
  
      if (!username || !role) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      if (id) {
        // Editar usuario existente
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx !== -1) {
          usuarios[idx].username = username;
          usuarios[idx].role = role;
        }
      } else {
        // Nuevo usuario
        const newId = (usuarios.length ? (parseInt(usuarios[usuarios.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        usuarios.push({id: newId, username, role});
      }
      saveUsuarios();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const user = usuarios.find(u => u.id === id);
        if (user) {
          openModal(modalId);
          fillUserForm(user);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          usuarios = usuarios.filter(u => u.id !== id);
          saveUsuarios();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    INICIALIZACIÓN SEGÚN PÁGINA
  ============================ */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
  
    switch(page) {
      case 'alumnos': initAlumnos(); break;
      case 'cursos': initCursos(); break;
      case 'calificaciones': initCalificaciones(); break;
      case 'dashboard': initDashboard(); break;
      case 'admin': initAdmin(); break;
      default: console.warn('No hay inicializador para esta página:', page);
    }
  });
 
  /* ============================
    FUNCIONES COMUNES DE MODALES
  ============================ */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'block';
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  }
  window.onclick = e => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  };
  document.querySelectorAll('.modal .btn-cancel').forEach(btn => {
    btn.addEventListener('click', e => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  
  /* ============================
    ALUMNOS
  ============================ */
  function initAlumnos() {
    const searchInput = document.querySelector('#alumnos-search');
    const tableBody = document.querySelector('#alumnos-table tbody');
    const addBtn = document.querySelector('#alumnos-add');
    const modalId = 'modal-alumno';
  
    let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [
      {id:'001', nombre:'Carlos', apellidos:'Ruiz', email:'carlos@example.com', telefono:'600123456'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#777;">No se encontraron alumnos.</td></tr>`;
        return;
      }
      data.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.apellidos}</td>
          <td>${a.email}</td>
          <td>${a.telefono}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar alumno">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar alumno">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveAlumnos() {
      localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = alumnos.filter(a =>
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillAlumnoForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillAlumnoForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['nombre'].value = data.nombre || '';
      form.elements['apellidos'].value = data.apellidos || '';
      form.elements['email'].value = data.email || '';
      form.elements['telefono'].value = data.telefono || '';
      titleModal.textContent = data.id ? `Editar Alumno ID ${data.id}` : 'Nuevo Alumno';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const nombre = form.elements['nombre'].value.trim();
      const apellidos = form.elements['apellidos'].value.trim();
      const email = form.elements['email'].value.trim();
      const telefono = form.elements['telefono'].value.trim();
  
      if (!nombre || !apellidos || !email || !telefono) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      if (id) {
        const idx = alumnos.findIndex(a => a.id === id);
        if (idx !== -1) {
          alumnos[idx] = {id, nombre, apellidos, email, telefono};
        }
      } else {
        const newId = (alumnos.length ? (parseInt(alumnos[alumnos.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        alumnos.push({id: newId, nombre, apellidos, email, telefono});
      }
      saveAlumnos();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const alumno = alumnos.find(a => a.id === id);
        if (alumno) {
          openModal(modalId);
          fillAlumnoForm(alumno);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este alumno?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          alumnos = alumnos.filter(a => a.id !== id);
          saveAlumnos();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    CURSOS
  ============================ */
  function initCursos() {
    const searchInput = document.querySelector('#cursos-search');
    const tableBody = document.querySelector('#cursos-table tbody');
    const addBtn = document.querySelector('#cursos-add');
    const modalId = 'modal-curso';
  
    let cursos = JSON.parse(localStorage.getItem('cursos')) || [
      {id:'001', nombre:'DAM', descripcion:'Desarrollo de Aplicaciones Multiplataforma'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#777;">No se encontraron cursos.</td></tr>`;
        return;
      }
      data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.nombre}</td>
          <td>${c.descripcion}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar curso">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar curso">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveCursos() {
      localStorage.setItem('cursos', JSON.stringify(cursos));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = cursos.filter(c =>
        c.nombre.toLowerCase().includes(term) ||
        c.descripcion.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillCursoForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillCursoForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['nombre'].value = data.nombre || '';
      form.elements['descripcion'].value = data.descripcion || '';
      titleModal.textContent = data.id ? `Editar Curso ID ${data.id}` : 'Nuevo Curso';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const nombre = form.elements['nombre'].value.trim();
      const descripcion = form.elements['descripcion'].value.trim();
  
      if (!nombre || !descripcion) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      if (id) {
        const idx = cursos.findIndex(c => c.id === id);
        if (idx !== -1) {
          cursos[idx] = {id, nombre, descripcion};
        }
      } else {
        const newId = (cursos.length ? (parseInt(cursos[cursos.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        cursos.push({id: newId, nombre, descripcion});
      }
      saveCursos();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const curso = cursos.find(c => c.id === id);
        if (curso) {
          openModal(modalId);
          fillCursoForm(curso);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este curso?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          cursos = cursos.filter(c => c.id !== id);
          saveCursos();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    CALIFICACIONES
  ============================ */
  function initCalificaciones() {
    const searchInput = document.querySelector('#calificaciones-search');
    const tableBody = document.querySelector('#calificaciones-table tbody');
    const addBtn = document.querySelector('#calificaciones-add');
    const modalId = 'modal-calificacion';
  
    let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [
      {id:'001', alumnoId:'001', alumnoNombre:'Carlos Ruiz', curso:'DAM', asignatura:'Programación', nota:7.5}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777;">No se encontraron calificaciones.</td></tr>`;
        return;
      }
      data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.alumnoNombre}</td>
          <td>${c.curso}</td>
          <td>${c.asignatura}</td>
          <td>${c.nota.toFixed(1)}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar calificación">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar calificación">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveCalificaciones() {
      localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = calificaciones.filter(c =>
        c.alumnoNombre.toLowerCase().includes(term) ||
        c.curso.toLowerCase().includes(term) ||
        c.asignatura.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillCalificacionForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillCalificacionForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['alumno'].innerHTML = getAlumnosOptions();
      form.elements['alumno'].value = data.alumnoId || '';
      form.elements['curso'].value = data.curso || 'DAM';
      form.elements['asignatura'].value = data.asignatura || '';
      form.elements['nota'].value = data.nota != null ? data.nota : '';
      titleModal.textContent = data.id ? `Editar Calificación ID ${data.id}` : 'Nueva Calificación';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    // Obtener opciones para select alumnos
    function getAlumnosOptions() {
      const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      if (alumnos.length === 0) return '<option value="">-- No hay alumnos --</option>';
      return alumnos.map(a => `<option value="${a.id}">${a.nombre} ${a.apellidos}</option>`).join('');
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const alumnoId = form.elements['alumno'].value;
      const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      const alumnoObj = alumnos.find(a => a.id === alumnoId);
      const alumnoNombre = alumnoObj ? `${alumnoObj.nombre} ${alumnoObj.apellidos}` : '';
      const curso = form.elements['curso'].value.trim();
      const asignatura = form.elements['asignatura'].value.trim();
      const nota = parseFloat(form.elements['nota'].value);
  
      if (!alumnoId || !curso || !asignatura || isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, complete todos los campos correctamente y la nota debe estar entre 0 y 10.');
        return;
      }
  
      if (id) {
        const idx = calificaciones.findIndex(c => c.id === id);
        if (idx !== -1) {
          calificaciones[idx] = {id, alumnoId, alumnoNombre, curso, asignatura, nota};
        }
      } else {
        const newId = (calificaciones.length ? (parseInt(calificaciones[calificaciones.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        calificaciones.push({id: newId, alumnoId, alumnoNombre, curso, asignatura, nota});
      }
      saveCalificaciones();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const calif = calificaciones.find(c => c.id === id);
        if (calif) {
          openModal(modalId);
          fillCalificacionForm(calif);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar esta calificación?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          calificaciones = calificaciones.filter(c => c.id !== id);
          saveCalificaciones();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    DASHBOARD
  ============================ */
  function initDashboard() {
    const contAlumnos = document.getElementById('count-alumnos');
    const contCursos = document.getElementById('count-cursos');
    const contCalificaciones = document.getElementById('count-calificaciones');
  
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
  
    if (contAlumnos) contAlumnos.textContent = alumnos.length;
    if (contCursos) contCursos.textContent = cursos.length;
    if (contCalificaciones) contCalificaciones.textContent = calificaciones.length;
  
    // Puedes añadir gráficos o datos adicionales aquí
  }
  
  
  /* ============================
    ADMINISTRACIÓN DE USUARIOS
  ============================ */
  function initAdmin() {
    const searchInput = document.querySelector('#admin-search');
    const tableBody = document.querySelector('#admin-table tbody');
    const addBtn = document.querySelector('#admin-add');
    const modalId = 'modal-admin';
  
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
      {id:'001', username:'admin', role:'Administrador'},
      {id:'002', username:'user1', role:'Usuario'}
    ];
  
    function renderTable(data) {
      tableBody.innerHTML = '';
      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#777;">No se encontraron usuarios.</td></tr>`;
        return;
      }
      data.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.id}</td>
          <td>${u.username}</td>
          <td>${u.role}</td>
          <td>
            <button class="btn-edit btn btn-sm" title="Editar usuario">Editar</button>
            <button class="btn-delete btn btn-sm btn-danger" title="Eliminar usuario">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    function saveUsuarios() {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  
    function filterTable() {
      const term = searchInput.value.toLowerCase();
      const filtered = usuarios.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      );
      renderTable(filtered);
    }
  
    searchInput.addEventListener('input', filterTable);
  
    addBtn.addEventListener('click', () => {
      openModal(modalId);
      fillUserForm();
    });
  
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    const titleModal = modal.querySelector('h3');
  
    function fillUserForm(data = {}) {
      form.reset();
      form.elements['id'].value = data.id || '';
      form.elements['username'].value = data.username || '';
      form.elements['role'].value = data.role || 'Usuario';
      titleModal.textContent = data.id ? `Editar Usuario ID ${data.id}` : 'Nuevo Usuario';
      form.querySelector('button[type=submit]').textContent = data.id ? 'Actualizar' : 'Guardar';
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const id = form.elements['id'].value.trim();
      const username = form.elements['username'].value.trim();
      const role = form.elements['role'].value;
  
      if (!username) {
        alert('Por favor, ingrese un nombre de usuario.');
        return;
      }
  
      if (id) {
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx !== -1) {
          usuarios[idx] = {id, username, role};
        }
      } else {
        const newId = (usuarios.length ? (parseInt(usuarios[usuarios.length - 1].id) + 1) : 1).toString().padStart(3, '0');
        usuarios.push({id: newId, username, role});
      }
      saveUsuarios();
      filterTable();
      closeModal(modalId);
    };
  
    tableBody.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const tr = e.target.closest('tr');
        const id = tr.children[0].textContent.trim();
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
          openModal(modalId);
          fillUserForm(usuario);
        }
      } else if (e.target.classList.contains('btn-delete')) {
        if (confirm('¿Seguro que deseas eliminar este usuario?')) {
          const tr = e.target.closest('tr');
          const id = tr.children[0].textContent.trim();
          usuarios = usuarios.filter(u => u.id !== id);
          saveUsuarios();
          filterTable();
        }
      }
    });
  
    filterTable();
  }
  
  
  /* ============================
    INICIALIZADOR GENERAL
  ============================ */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page; // en el <body data-page="alumnos|cursos|calificaciones|dashboard|admin">
  
    switch (page) {
      case 'alumnos':
        initAlumnos();
        break;
      case 'cursos':
        initCursos();
        break;
      case 'calificaciones':
        initCalificaciones();
        break;
      case 'dashboard':
        initDashboard();
        break;
      case 'admin':
        initAdmin();
        break;
      default:
        console.warn('Página no soportada o sin inicializador:', page);
    }
  });
