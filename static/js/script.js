// 🎯 Variables globales
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const modal = document.getElementById('prizeModal');
const prizeText = document.getElementById('prizeText');
const closeBtn = document.querySelector('.close');
const claimForm = document.getElementById('claimForm');
const prizeCode = document.getElementById('prizeCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const sendCodeBtn = document.getElementById('sendCodeBtn');
const result = document.querySelector('.result-text');
let hasSpun = false; // Variable para controlar si ya se ha girado
let currentRotation = 0;

// 🎯 Secciones con probabilidades
const sections = [
  { label: "5% Descuento", prob: 50 },
  { label: "10% Descuento", prob: 25 },
  { label: "15% Descuento", prob: 15 },
  { label: "20% Descuento", prob: 10 },
  { label: "Camiseta de regalo", prob: 0 },
  { label: "¡Gracias por participar!", prob: 0 }
];

// 🎲 Construir array ponderado
let weightedOptions = sections.flatMap((sec, i) => Array(sec.prob).fill(i));

// 🎨 Dibujo de la ruleta
const numSections = sections.length;
const anglePerSection = 360 / numSections;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) ; // Ajustado para que quepa bien

function drawWheel() {
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar el borde exterior
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Dibujar las secciones
  sections.forEach((section, index) => {
    const startAngle = anglePerSection * index;
    const endAngle = startAngle + anglePerSection;
    
    // Dibujar el sector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
    ctx.closePath();
    
    // Color para cada sección
    const color = `hsl(${(index * 60) % 360}, 45%, 50%)`;
    ctx.fillStyle = color;
    ctx.fill();
    
    // Dibujar el texto
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((startAngle + endAngle) / 2 * Math.PI / 180);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial'; // Aumentado el tamaño del texto
    ctx.fillText(section.label, radius * 0.6, 0); // Ajustado la posición del texto
    ctx.restore();
  });
}

// 🎯 Función para girar la ruleta
function girarRuletaFront() {
  // Elegir un índice aleatorio basado en las probabilidades
  const winnerIndex = weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
  const winnerLabel = sections[winnerIndex].label;


  // Calcular la rotación necesaria
  const anglePerSection = 360 / sections.length;
  const extraSpins = 5 * 360; // 5 vueltas completas
  const Correction = anglePerSection * (weightedOptions.length - winnerIndex);
  const totalRotation = extraSpins + Correction;

  return { premio: winnerLabel, rotacion: totalRotation };
}

async function girarRuleta() {
  try {
    // Simular la llamada a la API
    const result = girarRuletaFront();
    
    // Animar
    canvas.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.5, 1)";
    canvas.style.transform = `rotate(${result.rotacion}deg)`;

    return result;
  } catch (error) {
    console.error('Error al girar la ruleta:', error);
    throw error;
  }
}

// 🎯 Evento del botón de giro
spinBtn.addEventListener("click", async () => {
  if (hasSpun) {
    alert('¡Solo puedes girar una vez!');
    return;
  }

  // Deshabilitar el botón de giro
  spinBtn.disabled = true;
  spinBtn.disabled = true;
  
  try {
    const result = await girarRuleta();
    const { premio, rotacion } = result;
    
    // Generar código único
    const code = generateUniqueCode(premio);
    prizeCode.value = code;
    
    // Animar la ruleta
    canvas.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.5, 1)";
    canvas.style.transform = `rotate(${rotacion}deg)`;
    
    // Marcar que ya se ha girado
    hasSpun = true;
    
    // Habilitar el botón después de la animación
    setTimeout(() => {
      spinBtn.disabled = false;
      // Mostrar modal con el premio después de que termine la animación
      prizeText.textContent = `¡Has ganado: ${premio}!`;
      modal.style.display = "block";
    }, 4000);
  } catch (error) {
    console.error('Error:', error);
    spinBtn.disabled = false;
  }
});

// 🎯 Función para generar un código único
function generateUniqueCode(premio) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'UNTRAPO+';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `Soy el ganador del ${premio} mi código es ${code}`;
}

// 🎯 Evento para copiar el código
if (copyCodeBtn) {
  copyCodeBtn.addEventListener('click', () => {
    const code = prizeCode.value;
    navigator.clipboard.writeText(code).then(() => {
      copyCodeBtn.textContent = '¡Copiado!';
      setTimeout(() => {
        copyCodeBtn.textContent = 'Copiar código';
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar el código. Por favor, intenta nuevamente.');
    });
  });
}


// 🎯 Evento del botón de cerrar modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  hasSpun = false;
  spinBtn.disabled = false;
  spinBtn.textContent = 'Girar 🎯';
});

// 🎯 Evento del enlace de Instagram
if (sendCodeBtn) {
  sendCodeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(sendCodeBtn.href, '_blank');
  });
}


// 🎯 Evento del botón de cerrar modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  hasSpun = false;
  spinBtn.disabled = false;
  spinBtn.textContent = 'Girar 🎯';
  claimForm.style.display = 'none';
});


// 🎯 Evento de click en el overlay
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// 🎨 Dibujar la ruleta inicialmente
drawWheel();


