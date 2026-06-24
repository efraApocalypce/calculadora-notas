// app.js - Lógica general de la aplicación

let materiaActualId = null;
let datosApp = { materias: [] };

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
    const nombre = prompt("Nombre de la nueva materia:", "Nueva Materia");
    if (!nombre) return;

    const nuevaMateria = {
        id: "mat-" + Date.now(),
        nombre: nombre,
        escala: 7,
        notaObjetivo: 4.0,
        evaluaciones: []
    };

    datosApp.materias.push(nuevaMateria);
    materiaActualId = nuevaMateria.id;

    actualizarSelectorMaterias();
    cargarMateria(nuevaMateria.id);
    guardarTodo();
}

function actualizarSelectorMaterias() {
    const select = document.getElementById('selectorMaterias');
    select.innerHTML = '';

    datosApp.materias.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.id;
        option.textContent = materia.nombre;
        if (materia.id === materiaActualId) option.selected = true;
        select.appendChild(option);
    });
}

function cambiarMateria() {
    const select = document.getElementById('selectorMaterias');
    materiaActualId = select.value;
    cargarMateria(materiaActualId);
}

function cargarMateria(id) {
    const materia = datosApp.materias.find(m => m.id === id);
    if (!materia) return;

    // Cargar datos de la materia
    document.getElementById('nombreMateriaActual').value = materia.nombre;
    document.getElementById('escala').value = materia.escala;
    escalaActual = materia.escala;
    cambiarEscala();

    if (materia.notaObjetivo) {
        document.getElementById('notaObjetivo').value = materia.notaObjetivo;
    }

    // Cargar evaluaciones
    const contenedor = document.getElementById('evaluaciones');
    contenedor.innerHTML = '';

    if (materia.evaluaciones && materia.evaluaciones.length > 0) {
        materia.evaluaciones.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'evaluacion';
            div.innerHTML = `
                <input type="text" class="nombre" value="${ev.nombre}" placeholder="Nombre (Ej: Prueba 1)">
                <input type="number" class="nota" step="0.1" value="${ev.nota}" placeholder="Nota">
                <input type="number" class="porcentaje" step="1" value="${ev.porcentaje}" placeholder="%" style="width:80px">%
                <button onclick="this.parentElement.remove()" class="eliminar">Eliminar</button>
            `;
            contenedor.appendChild(div);
        });
    } else {
        agregarEvaluacion();
    }
}

// ====================== GUARDAR TODO ======================
function guardarTodo() {
    const datos = {
        nombreUsuario: document.getElementById('nombreUsuario').value.trim() || "Usuario",
        materias: datosApp.materias,
        materiaActualId: materiaActualId
    };
    localStorage.setItem("datosCalculadora", JSON.stringify(datos));
}

// ====================== INICIALIZACIÓN ======================
window.onload = () => {
    cargarNombre();

    // Cargar datos guardados
    const datosGuardados = localStorage.getItem("datosCalculadora");
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        datosApp.materias = datos.materias || [];
        materiaActualId = datos.materiaActualId;

        if (datosApp.materias.length === 0) {
            // Crear materia por defecto si no hay ninguna
            datosApp.materias.push({
                id: "mat-default",
                nombre: "Matemáticas",
                escala: 7,
                notaObjetivo: 4.0,
                evaluaciones: []
            });
            materiaActualId = "mat-default";
        }
    }

    actualizarSelectorMaterias();
    
    if (materiaActualId) {
        cargarMateria(materiaActualId);
    }

    console.log("✅ Aplicación con múltiples materias cargada");
};