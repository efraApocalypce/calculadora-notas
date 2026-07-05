// app.js - Lógica general de la aplicación

let materiaActualId = null;
let decimalesConfig = 2;

// ====================== NOMBRE DE USUARIO ======================
function guardarNombre() {
    const nombreInput = document.getElementById('nombreUsuario').value.trim();
    if (nombreInput === "") return;
    localStorage.setItem("nombreUsuario", nombreInput);
}

function cargarNombre() {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (nombreGuardado) {
        document.getElementById('nombreUsuario').value = nombreGuardado;
    }
}

// ====================== GESTIÓN DE MATERIAS ======================
function crearNuevaMateria() {
    document.getElementById('inputNuevaMateria').value = '';
    document.getElementById('modalNuevaMateria').style.display = 'flex';
    document.getElementById('inputNuevaMateria').focus();
}

function confirmarNuevaMateria() {
    guardarEvaluacionesMateriaActual();

    const nombre = document.getElementById('inputNuevaMateria').value.trim();
    if (!nombre) {
        alert("Por favor escribe un nombre para la materia");
        return;
    }

    const config = JSON.parse(localStorage.getItem("configApp")) || { escalaDefecto: 7 };

    const nuevaMateria = {
        id: 'mat' + Date.now(),
        nombre: nombre,
        escala: config.escalaDefecto || 7,
        notaObjetivo: 4.0,
        evaluaciones: []
    };

    let datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    datos.materias.push(nuevaMateria);
    materiaActualId = nuevaMateria.id;

    guardarDatosCalculadora(datos);

    actualizarListaSidebar();
    cargarMateria(nuevaMateria.id);
    cerrarModalNuevaMateria();
}

function cancelarNuevaMateria() {
    cerrarModalNuevaMateria();
}

function cerrarModalNuevaMateria() {
    document.getElementById('modalNuevaMateria').style.display = 'none';
}

function actualizarListaSidebar() {
    const lista = document.getElementById('listaAsignaturasSidebar');
    if (!lista) return; // Ya no existe esta sidebar fija en el HTML actual
    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    
    lista.innerHTML = '';

    datos.materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = `asignatura-sidebar ${materia.id === materiaActualId ? 'active' : ''}`;
        div.innerHTML = `
            <div class="nombre">${materia.nombre}</div>
            <div class="info">${materia.evaluaciones ? materia.evaluaciones.length : 0} evaluaciones</div>
        `;
        div.onclick = () => {
            materiaActualId = materia.id;
            cargarMateria(materia.id);
            actualizarListaSidebar();
        };
        lista.appendChild(div);
    });
}

function cargarMateria(id) {
    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const materia = datos.materias.find(m => m.id === id);
    if (!materia) return;

    materiaActualId = id;

    document.getElementById('nombreMateriaActual').value = materia.nombre;
    document.getElementById('escala').value = materia.escala || 7;
    escalaActual = materia.escala || 7;
    cambiarEscala();

    document.getElementById('notaObjetivo').value = materia.notaObjetivo || 4.0;

    const contenedor = document.getElementById('evaluaciones');
    contenedor.innerHTML = '';

    if (materia.evaluaciones && materia.evaluaciones.length > 0) {
        materia.evaluaciones.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'evaluacion';
            div.innerHTML = `
                <input type="text" class="nombre" value="${ev.nombre || ''}" placeholder="Nombre (Ej: Prueba 1)">
                <input type="number" class="nota" step="0.1" value="${ev.nota || ''}" placeholder="Nota">
                <input type="number" class="porcentaje" step="1" value="${ev.porcentaje || ''}" placeholder="%" style="width:80px">%
                <button onclick="this.parentElement.remove()" class="eliminar">Eliminar</button>
            `;
            contenedor.appendChild(div);
        });
    } else {
        agregarEvaluacion();
    }
}

function guardarNombreMateriaActual() {
    const nombre = document.getElementById('nombreMateriaActual').value.trim();
    if (!nombre || !materiaActualId) return;

    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const materia = datos.materias.find(m => m.id === materiaActualId);
    if (materia) {
        materia.nombre = nombre;
        guardarDatosCalculadora(datos);
        actualizarListaSidebar();
    }
}

function guardarEvaluacionesMateriaActual() {
    if (!materiaActualId) return;

    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const materia = datos.materias.find(m => m.id === materiaActualId);
    if (!materia) return;

    const evaluaciones = [];
    document.querySelectorAll('.evaluacion').forEach(ev => {
        evaluaciones.push({
            nombre: ev.querySelector('.nombre').value.trim(),
            nota: parseFloat(ev.querySelector('.nota').value) || 0,
            porcentaje: parseFloat(ev.querySelector('.porcentaje').value) || 0
        });
    });

    materia.evaluaciones = evaluaciones;
    materia.notaObjetivo = parseFloat(document.getElementById('notaObjetivo').value) || materia.notaObjetivo;
    materia.escala = escalaActual;

    guardarDatosCalculadora(datos);
}

function mostrarAsignaturas() {
    guardarEvaluacionesMateriaActual();
    actualizarListaAsignaturasModal();
    document.getElementById('modalAsignaturas').style.display = 'flex';
}

function actualizarListaAsignaturasModal() {
    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const lista = document.getElementById('listaAsignaturasModal');

    lista.innerHTML = '';

    if (datos.materias.length === 0) {
        lista.innerHTML = '<p>No tienes asignaturas aún. Crea una nueva.</p>';
    } else {
        datos.materias.forEach(materia => {
            const div = document.createElement('div');
            div.className = `asignatura-sidebar ${materia.id === materiaActualId ? 'active' : ''}`;
            div.innerHTML = `
                <div>
                    <div class="nombre">${materia.nombre}</div>
                    <div class="info">${materia.evaluaciones ? materia.evaluaciones.length : 0} evaluaciones</div>
                </div>
                <button onclick="eliminarMateria('${materia.id}'); event.stopImmediatePropagation();" class="btn-eliminar">Eliminar</button>
            `;
            div.onclick = () => {
                guardarEvaluacionesMateriaActual();
                materiaActualId = materia.id;
                cargarMateria(materia.id);
                cerrarModal();
            };
            lista.appendChild(div);
        });
    }
}

function cerrarModal() {
    document.getElementById('modalAsignaturas').style.display = 'none';
}

let materiaAEliminar = null;

function eliminarMateria(id) {
    materiaAEliminar = id;
    document.getElementById('mensajeConfirmacion').textContent = 
        "¿Estás seguro de eliminar esta asignatura y todas sus evaluaciones?";
    document.getElementById('modalConfirmacion').style.display = 'flex';
}

function confirmarEliminacion() {
    if (!materiaAEliminar) return;

    let datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    
    datos.materias = datos.materias.filter(m => m.id !== materiaAEliminar);

    if (materiaActualId === materiaAEliminar) {
        if (datos.materias.length > 0) {
            materiaActualId = datos.materias[0].id;
        } else {
            materiaActualId = null;
        }
    }

    guardarDatosCalculadora(datos);

    // Si el modal de asignaturas está abierto, refrescar su lista al instante
    const modalAsignaturas = document.getElementById('modalAsignaturas');
    if (modalAsignaturas.style.display === 'flex') {
        actualizarListaAsignaturasModal();
    }

    if (materiaActualId) {
        cargarMateria(materiaActualId);
    }

    cerrarConfirmacion();
    materiaAEliminar = null;
}

function cancelarEliminacion() {
    cerrarConfirmacion();
    materiaAEliminar = null;
}

function cerrarConfirmacion() {
    document.getElementById('modalConfirmacion').style.display = 'none';
}

// ====================== CONFIGURACIÓN ======================
function mostrarConfiguracion() {
    const config = JSON.parse(localStorage.getItem("configApp")) || { escalaDefecto: 7, decimales: 2 };
    document.getElementById('configEscalaDefecto').value = config.escalaDefecto;
    document.getElementById('configDecimales').value = config.decimales;
    document.getElementById('modalConfiguracion').style.display = 'flex';
}

function cerrarModalConfiguracion() {
    document.getElementById('modalConfiguracion').style.display = 'none';
}

function guardarConfiguracion() {
    const config = {
        escalaDefecto: parseInt(document.getElementById('configEscalaDefecto').value),
        decimales: parseInt(document.getElementById('configDecimales').value)
    };
    localStorage.setItem("configApp", JSON.stringify(config));
    decimalesConfig = config.decimales;
}

function cargarConfiguracion() {
    const config = JSON.parse(localStorage.getItem("configApp")) || { escalaDefecto: 7, decimales: 2 };
    decimalesConfig = config.decimales;
}

// ====================== EXPORTAR / IMPORTAR ======================
function exportarDatos() {
    const datos = localStorage.getItem("datosCalculadora") || '{"materias":[]}';
    const blob = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "mis-notas-backup.json";
    enlace.click();

    URL.revokeObjectURL(url);
}

function importarDatos(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e) => {
        try {
            const datos = JSON.parse(e.target.result);
            if (!datos.materias) throw new Error("Formato inválido");

            guardarDatosCalculadora(datos);
            materiaActualId = datos.materiaActualId || (datos.materias[0] ? datos.materias[0].id : null);
            
            if (materiaActualId) cargarMateria(materiaActualId);
            alert("Datos importados correctamente");
            cerrarModalConfiguracion();
        } catch (error) {
                alert("El archivo no es válido o está dañado");
        }
    };
    lector.readAsText(archivo);
    event.target.value = ''; // Limpiar el input para poder importar el mismo archivo nuevamente si se desea
}

// ====================== BORRAR TODO ======================
function borrarTodosLosDatos() {
    const confirmado = confirm("¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.");
    if (!confirmado) return;

    guardarDatosCalculadora({ materias: [] });
    materiaActualId = null;
    cerrarModalConfiguracion();
    crearNuevaMateria();
}

// ====================== PERFIL ======================
function mostrarPerfil() {
    guardarEvaluacionesMateriaActual();
    cargarNombre();
    actualizarEstadisticasPerfil();
    actualizarResumenMateriasPerfil();
    document.getElementById('modalPerfil').style.display = 'flex';
}

function cerrarModalPerfil() {
    document.getElementById('modalPerfil').style.display = 'none';
}

function actualizarEstadisticasPerfil() {
    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const totalMaterias = datos.materias.length;
    const totalEvaluaciones = datos.materias.reduce(
        (acc, m) => acc + (m.evaluaciones ? m.evaluaciones.length : 0), 0
    );

    document.getElementById('estadisticasPerfil').innerHTML = `
        <p>📚 Tienes <strong>${totalMaterias}</strong> materia${totalMaterias !== 1 ? 's' : ''} registrada${totalMaterias !== 1 ? 's' : ''}</p>
        <p>📝 Con un total de <strong>${totalEvaluaciones}</strong> evaluación${totalEvaluaciones !== 1 ? 'es' : ''} guardada${totalEvaluaciones !== 1 ? 's' : ''}</p>
    `;
}

function actualizarResumenMateriasPerfil() {
    const datos = JSON.parse(localStorage.getItem("datosCalculadora")) || { materias: [] };
    const contenedor = document.getElementById('resumenMateriasPerfil');
    contenedor.innerHTML = '';

    if (datos.materias.length === 0) {
        contenedor.innerHTML = '<p>No tienes materias registradas.</p>';
        return;
    }

    datos.materias.forEach(materia => {
        let sumaPonderada = 0;
        let totalPorcentaje = 0;

        (materia.evaluaciones || []).forEach(ev => {
            sumaPonderada += (ev.nota || 0) * (ev.porcentaje || 0);
            totalPorcentaje += (ev.porcentaje || 0);
        });

        let textoPromedio = 'Sin evaluaciones registradas';
        if (totalPorcentaje > 0) {
            const promedio = sumaPonderada / totalPorcentaje;
            textoPromedio = `Promedio actual: <strong>${promedio.toFixed(decimalesConfig)}</strong> (${totalPorcentaje.toFixed(0)}% evaluado)`;
        }

        const div = document.createElement('div');
        div.className = 'materia-resumen-item';
        div.innerHTML = `
            <div class="nombre">${materia.nombre}</div>
            <div class="info">${textoPromedio}</div>
        `;
        contenedor.appendChild(div);
    });
}

// ====================== VISTA PREVIA LOGIN/SIGNUP ======================
function mostrarLoginPreview() {
    document.getElementById('authContainer').classList.remove('active');
    document.getElementById('modalLoginPreview').style.display = 'flex';
}

function cerrarModalLoginPreview() {
    document.getElementById('modalLoginPreview').style.display = 'none';
}

function activarModoSignup() {
    document.getElementById('authContainer').classList.add('active');
}

function activarModoLogin() {
    document.getElementById('authContainer').classList.remove('active');
}

// ====================== CONECTAR FORMULARIOS CON FIREBASE ======================
function manejarLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        document.getElementById('authErrorLogin').textContent = 'Completa ambos campos.';
        return;
    }
    window.iniciarSesionConFirebase(email, password);
}

function manejarSignup() {
    const nombre = document.getElementById('signupNombre').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!nombre || !email || !password) {
        document.getElementById('authErrorSignup').textContent = 'Completa todos los campos.';
        return;
    }
    window.registrarConFirebase(email, password);
}

// ====================== LOGIN SOCIAL (GOOGLE / GITHUB) ======================
function manejarLoginGoogle() {
    window.loginConGoogle('authErrorLogin');
}

function manejarLoginGithub() {
    window.loginConGithub('authErrorLogin');
}

function manejarSignupGoogle() {
    window.loginConGoogle('authErrorSignup');
}

function manejarSignupGithub() {
    window.loginConGithub('authErrorSignup');
}

// ====================== ESTADO DE SESIÓN EN PERFIL ======================
function actualizarUIAuth(user) {
    const estadoDiv = document.getElementById('estadoSesion');
    if (!estadoDiv) return;

    if (user) {
        estadoDiv.innerHTML = `
            <p>✅ Sesión iniciada como <strong>${user.email}</strong></p>
            <button onclick="cerrarSesionFirebase()" class="btn-borrar-todo">Cerrar sesión</button>
        `;
    } else {
        estadoDiv.innerHTML = `<p>🔒 No has iniciado sesión</p>`;
    }
}

// ====================== SINCRONIZACIÓN CON LA NUBE ======================
function guardarDatosCalculadora(datos) {
    localStorage.setItem("datosCalculadora", JSON.stringify(datos));
    if (typeof window.sincronizarConFirestore === 'function') {
        window.sincronizarConFirestore(datos);
    }
}

function cargarDatosDesdeNube(datosNube) {
    localStorage.setItem("datosCalculadora", JSON.stringify(datosNube));

    if (datosNube.materias && datosNube.materias.length > 0) {
        materiaActualId = datosNube.materiaActualId || datosNube.materias[0].id;
    } else {
        materiaActualId = null;
    }

    actualizarListaSidebar();

    if (materiaActualId) {
        cargarMateria(materiaActualId);
    } else {
        crearNuevaMateria();
    }
}

// ====================== INICIALIZACIÓN ======================
window.onload = () => {
    cargarConfiguracion();
    cargarNombre();

    const datosGuardados = localStorage.getItem("datosCalculadora");
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        if (datos.materias && datos.materias.length > 0) {
            materiaActualId = datos.materiaActualId || datos.materias[0].id;
        }
    }

    actualizarListaSidebar();

    if (materiaActualId) {
        cargarMateria(materiaActualId);
    } else {
        crearNuevaMateria();
    }
};