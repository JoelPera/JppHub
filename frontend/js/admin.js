// js/admin.js

function attemptLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if(u === 'admin' && p === 'sbs2026') {
        document.getElementById('loginView').classList.add('hidden');
        document.getElementById('dashboardView').classList.remove('hidden');
        loadAdminTable();
    } else {
        document.getElementById('errorMsg').style.display = 'block';
    }
}

function loadAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';
    
    // Usamos articlesDB que viene de main.js
    articlesDB.forEach(art => {
        tbody.innerHTML += `
            <tr>
                <td><small>${art.id}</small></td>
                <td><strong>${art.title}</strong><br><small>${art.date}</small></td>
                <td><span class="badge">${art.category}</span></td>
                <td>
                    <button class="btn" style="padding: 4px 8px; font-size: 0.8rem; margin: 0;" onclick="editPost('${art.id}')">Editar</button>
                    <button class="btn" style="padding: 4px 8px; font-size: 0.8rem; margin: 0; background: #ef4444;" onclick="deletePost('${art.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function editPost(id) {
    alert(`Abriendo editor para el artículo: ${id}\n(Aquí se mostraría el formulario pre-llenado)`);
}

function deletePost(id) {
    if(confirm(`¿Seguro que deseas eliminar el artículo ${id}?`)) {
        alert("Petición DELETE enviada. (Simulación)");
        // Aquí conectarías un fetch() a tu API
    }
}

function triggerAutoGeneration() {
    const btn = event.target;
    btn.innerHTML = "⏳ Procesando RSS/IA...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
        alert("¡Proceso exitoso!\n\n1. Webhooks procesados.\n2. IA redactó contenido.\n3. Archivos generados en el servidor.");
        btn.innerHTML = "⚡ Generar con API/n8n";
        btn.style.opacity = "1";
    }, 2000);
}