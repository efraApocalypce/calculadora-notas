let escalaActual = 7; // por defecto 1-7

function cambiarEscala() {
    escalaActual = parseInt(document.getElementById('escala').value);
    
    const min = escalaActual === 7 ? 1 : 0;
    const max = escalaActual;
    const defaultNota = escalaActual === 7 ? 4.0 : 60;

    document.getElementById('notaActual').min = min;
    document.getElementById('notaActual').max = max;
    document.getElementById('notaActual').value = defaultNota;

    document.getElementById('notaObjetivo').min = min;
    document.getElementById('notaObjetivo').max = max;
    document.getElementById('notaObjetivo').value = defaultNota;
}

function calcular() {
    const notaActual = parseFloat(document.getElementById('notaActual').value);
    const porcActual = parseFloat(document.getElementById('porcentajeActual').value);
    const notaObjetivo = parseFloat(document.getElementById('notaObjetivo').value);

    const porcRestante = 100 - porcActual;
    
    // Fórmula general
    const notaNecesaria = ((notaObjetivo * 100) - (notaActual * porcActual)) / porcRestante;

    const resultado = document.getElementById('resultado');
    const escala = escalaActual === 7 ? "7.0" : "100";

    if (notaNecesaria > notaObjetivo * 1.1) {  // Un poco de tolerancia
        resultado.innerHTML = `❌ Necesitas <strong>${notaNecesaria.toFixed(2)}</strong> en lo que queda.<br>Es muy difícil o imposible llegar a ${notaObjetivo} 😔`;
        resultado.style.color = "#ff4444";
    } 
    else if (notaNecesaria < 1 && escalaActual === 7 || notaNecesaria < 0) {
        resultado.innerHTML = `✅ Ya tienes más de lo necesario.<br>Solo mantén una nota positiva.`;
        resultado.style.color = "#4CAF50";
    } 
    else {
        resultado.innerHTML = `📊 Necesitas sacar <strong>${notaNecesaria.toFixed(2)}</strong> en el ${porcRestante}% restante<br><small>(Escala ${escala})</small>`;
        resultado.style.color = "#4CAF50";
    }
}

// Inicializar
cambiarEscala();