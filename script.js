// script.js - Lógica específica de la calculadora

let escalaActual = 7;

// ====================== ESCALA ======================
function cambiarEscala() {
    escalaActual = parseInt(document.getElementById('escala').value);
    
    let min = 0;
    let max = escalaActual;
    let defaultNota = 6.0;

    if (escalaActual === 7) {
        min = 1;
        defaultNota = 4.0;
    } else if (escalaActual === 10) {
        defaultNota = 6.0;
    } else if (escalaActual === 20) {
        defaultNota = 12;
    } else if (escalaActual === 100) {
        defaultNota = 60;
    }

    const notaObjetivo = document.getElementById('notaObjetivo');
    notaObjetivo.min = min;
    notaObjetivo.max = max;
    notaObjetivo.value = defaultNota;

    document.querySelectorAll('.nota').forEach(input => {
        input.min = min;
        input.max = max;
    });
}

// ====================== EVALUACIONES ======================
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

    document.querySelectorAll('.evaluacion').forEach(ev => {
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
    if (notaNecesaria > escalaActual) {
        mensaje = `❌ Imposible alcanzar el objetivo.<br>Necesitarías <strong>${notaNecesaria.toFixed(2)}</strong>`;
    } else if (notaNecesaria < 0) {
        mensaje = `✅ Ya superaste el objetivo.`;
    } else {
        mensaje = `📊 Necesitas sacar <strong>${notaNecesaria.toFixed(2)}</strong> en el ${porcentajeRestante.toFixed(1)}% restante`;
    }

    resultadoDiv.innerHTML = mensaje;
}