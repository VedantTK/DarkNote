// main JS for modals, AJAX form submits, logout, and notes
document.addEventListener('DOMContentLoaded', function () {
  const signinModal = new bootstrap.Modal(document.getElementById('signinModal'));
  const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
  const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));

  // open modal buttons
  document.querySelectorAll('#signinBtn, #signinBtnLarge').forEach(btn => {
    if (btn) btn.addEventListener('click', () => signinModal.show());
  });
  document.querySelectorAll('#signupBtn, #signupBtnLarge').forEach(btn => {
    if (btn) btn.addEventListener('click', () => signupModal.show());
  });
  // new note buttons
  document.querySelectorAll('#newNoteBtn, #newNoteBtnLarge').forEach(btn => {
    if (btn) btn.addEventListener('click', () => noteModal.show());
  });

  // Sign up form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(payload)
      });
      const result = await res.json();
      const alert = document.getElementById('signupAlert');
      alert.classList.remove('d-none','alert-success','alert-danger');
      if (res.ok && result.success) {
        alert.classList.add('alert-success');
        alert.textContent = result.message || 'Account created.';
        window.location.href = '/dashboard';
      } else {
        alert.classList.add('alert-danger');
        alert.textContent = result.message || 'Error creating account';
      }
    });
  }

  // Sign in form
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(signinForm);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(payload)
      });
      const result = await res.json();
      const alert = document.getElementById('signinAlert');
      alert.classList.remove('d-none','alert-success','alert-danger');
      if (res.ok && result.success) {
        alert.classList.add('alert-success');
        alert.textContent = result.message || 'Logged in';
        window.location.href = '/dashboard';
      } else {
        alert.classList.add('alert-danger');
        alert.textContent = result.message || 'Invalid credentials';
      }
    });
  }

  // Note modal form submit (AJAX, append to feed)
  const noteFormModal = document.getElementById('noteFormModal');
  if (noteFormModal) {
    noteFormModal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(noteFormModal);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/notes/create', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new URLSearchParams(payload)
      });
      const result = await res.json();
      const alert = document.getElementById('noteModalAlert');
      alert.classList.remove('d-none','alert-success','alert-danger');
      if (res.ok && result.success) {
        alert.classList.add('alert-success');
        alert.textContent = 'Note posted';
        // close modal and insert the note at the top
        setTimeout(() => {
          noteModal.hide();
          noteFormModal.reset();
          insertNoteIntoFeed(result.note);
        }, 300);
      } else {
        alert.classList.add('alert-danger');
        alert.textContent = result.message || 'Failed to post note';
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const res = await fetch('/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/';
      } else {
        alert('Logout failed');
      }
    });
  }

  // helper to insert a note card into #notesList
  function insertNoteIntoFeed(note) {
    // note: { id, content, author, created_at }
    const list = document.getElementById('notesList');
    if (!list) return;

    // build the card structure
    const col = document.createElement('div');
    col.className = 'col-12';

    const card = document.createElement('div');
    card.className = 'card bg-secondary text-light';

    const body = document.createElement('div');
    body.className = 'card-body';

    const p = document.createElement('p');
    p.className = 'mb-1';
    p.appendChild(document.createTextNode(note.content));

    const meta = document.createElement('div');
    meta.className = 'small text-muted';
    // format created_at to something readable (YYYY-MM-DD HH:MM)
    let createdAt = note.created_at;
    try {
      const dt = new Date(createdAt);
      const y = dt.getFullYear();
      const mo = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      const h = String(dt.getHours()).padStart(2, '0');
      const mi = String(dt.getMinutes()).padStart(2, '0');
      createdAt = `${y}-${mo}-${d} ${h}:${mi}`;
    } catch (e) {
      // keep original string
    }
    meta.textContent = `— ${note.author} • ${createdAt}`;

    body.appendChild(p);
    body.appendChild(meta);
    card.appendChild(body);
    col.appendChild(card);

    // prepend the new note to the top
    if (list.firstChild) {
      list.insertBefore(col, list.firstChild);
    } else {
      list.appendChild(col);
    }
  }
});
