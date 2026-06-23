let escalaActual = 7;

function cambiarEscala() {
    escalaActual = parseInt(document.getElementById('escala').value);
}
    let min = 0;
    let max = escalaActual;
    let defaultNota = 4.0;

    if (escalaActual === 7) { 
        min = 1.0;
        defaultNota = 4.0;
    } else if (escalaActual === 10) {
        min = 0;
        max = 10;
        defaultNota = 4.0;
    } else if (escalaActual === 20) {
        min = 0;
        max = 20;
        defaultNota = 4.0;
    } else if (escalaActual === 100) {
        min = 0;
        max = 100;
        defaultNota = 50.0;
    }

    document.getElementById('notaObjetivo').min = min;
    document.getElementById('notaObjetivo').max = max;
    document.getElementById('notaObjetivo').value = defaultNota;

    document.querySelectorAll('.nota').forEach(input => {
        input.min = min;
        input.max = max;
    });

function agregarEvaluacion() {
    const div = document.createElement('div');
    div.className = 'evaluacion';
    div.innerHTML = `
        <input type="text" class="nombre" placeholder="Nombre (Ej: Prueba 1)">
        <input type="number" class="nota" step="0.1" placeholder="Nota">
        <input type="number" class="porcentaje" step="1" placeholder="%" style="width:80px">%
        <button onclick="this.parentElement.remove()" class="eliminar">Eliminar</button>
    `;
    document.getElementById('evaluaciones').appendChild(div);
}

function calcularTodo() {
    let sumaPonderada = 0;
    let totalPorcentaje = 0;

    const evaluaciones = document.querySelectorAll('.evaluacion');

    evaluaciones.forEach(ev => {
        const nota = parseFloat(ev.querySelector('.nota').value) || 0;
        const porcentaje = parseFloat(ev.querySelector('.porcentaje').value) || 0;

        sumaPonderada += nota * porcentaje;
        totalPorcentaje += porcentaje;
    });

    const notaObjetivo = parseFloat(document.getElementById('notaObjetivo').value);
    const porcentajeRestante = 100 - totalPorcentaje;
    const resultadoDiv = document.getElementById('resultado');

    if (porcentajeRestante <= 0) {
        resultadoDiv.innerHTML = `<strong style="color:green">✅ Ya completaste el 100%</strong>`;
        return;
    }

    const notaNecesaria = ((notaObjetivo * 100) - sumaPonderada) / porcentajeRestante;

    let mensaje = '';
    let maxEscala = escalaActual;

    if (notaNecesaria > maxEscala) {
        mensaje = `❌ Imposible alcanzar el objetivo.<br>Necesitarías <strong>${notaNecesaria.toFixed(2)}</strong> (máximo es ${maxEscala})`;
    } else if (notaNecesaria < 0) {
        mensaje = `✅ Ya superaste el objetivo.`;
    } else {
        mensaje = `📊 Necesitas sacar <strong>${notaNecesaria.toFixed(2)}</strong> en el ${porcentajeRestante.toFixed(1)}% restante`;
    }

    resultadoDiv.innerHTML = mensaje;
}

function guardarNombre() {
    const nombreInput = document.getElementById('nombreUsuario').value.trim();
    if (nombreInput === " ") {
        alert("Por favor, ingresa tu nombre");
        return;
    }
    localStorage.setItem("nombreUsuario", nombreInput);
    console.log("Nombre guardado", nombreInput);
}

function cargarNombre() {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (nombreGuardado) {
        document.getElementById('nombreUsuario').value = nombreGuardado;
    }
}

function guardarDatos() {
    const nombre = document.getElementById('nombreUsuario').value.trim()  || "Usuario";

    const datos = {
        nombreUsario: nombre,
        escala : escalaActual,
        evaluaciones: []
    };

    localStorage.setItem("datosCalculadora", JSON.stringify(datos));
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem("datosCalculadora");

    if (datosGuardados) {
        document.getElementById('nombreUsuario').value = datos.nombreUsario;
    }

    console.log("Datos cargados", datos);
}

//Cuando se carga la pagina
windowq.onload = () => {
    agregarEvaluacion();
    camiarEscala();
    cargarDatos();
    cargarNombre();
};
// Agregar una evaluación por defecto al cargar
window.onload = () => {
    agregarEvaluacion();
    cambiarEscala();
};