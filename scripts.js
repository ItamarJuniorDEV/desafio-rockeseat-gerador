const quantidadeNumeros = document.getElementById('quantidade');
const numeroMin = document.getElementById('numero-min');
const numeroMax = document.getElementById('numero-max');
const naoRepetir = document.getElementById('nao-repetir');
const resultado = document.getElementById('resultado');
const sorteadorForm = document.getElementById('sorteador-form');
const botaoSortear = document.getElementById('btn-sortear');
const numerosSorteados = document.getElementById('numeros-sorteados');
const listaHistorico = document.getElementById('lista-historico');
const toggleThemeButton = document.getElementById('toggle-theme');

let audioSuspense;

sorteadorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sortearNumeros();
});

toggleThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

function sortearNumeros() {
  if (quantidadeNumeros.value === '' || numeroMin.value === '' || numeroMax.value === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const quantidade = parseInt(quantidadeNumeros.value);
  const min = parseInt(numeroMin.value);
  const max = parseInt(numeroMax.value);
  const repetir = !naoRepetir.checked;

  if (min > max) {
    alert('O número mínimo deve ser menor que o número máximo.');
    return;
  }

  if (!repetir && (max - min + 1) < quantidade) {
    alert('Não é possível sortear essa quantidade de números sem repetição no intervalo especificado.');
    return;
  }

  const numeros = sortearNumerosUnicos(quantidade, min, max, repetir);
  exibirNumerosSorteados(numeros);
  adicionarAoHistorico(numeros);
}

function sortearNumerosUnicos(quantidade, min, max, repetir) {
  const numeros = new Set();
  while (numeros.size < quantidade) {
    const numero = Math.floor(Math.random() * (max - min + 1)) + min;
    if (repetir || !numeros.has(numero)) {
      numeros.add(numero);
    }
  }
  
  return Array.from(numeros);
}

function exibirNumerosSorteados(numeros) {
  numerosSorteados.textContent = 'Sorteando...';
  botaoSortear.disabled = true;

  iniciarSomSuspense();

  let indice = 0;
  const intervalId = setInterval(() => {
    if (indice < numeros.length) {
      numerosSorteados.textContent = numeros.slice(0, indice + 1).join(', ');
      indice++;
    } else {
      clearInterval(intervalId);
      finalizarSorteio();
    }
  }, 1000);
}

function finalizarSorteio() {
  botaoSortear.disabled = false;
  numerosSorteados.classList.add('resultado-final');
  setTimeout(() => numerosSorteados.classList.remove('resultado-final'), 1000);
  pararSomSuspense();
  reproduzirSomFinal();
}

function adicionarAoHistorico(numeros) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = numeros.join(', ');
  
  const btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.classList.add('btn-excluir');
  btnExcluir.addEventListener('click', () => excluirDoHistorico(li));

  li.appendChild(span);
  li.appendChild(btnExcluir);
  listaHistorico.insertBefore(li, listaHistorico.firstChild);

  if (listaHistorico.children.length > 5) {
    listaHistorico.removeChild(listaHistorico.lastChild);
  }

  salvarHistorico();
}

function excluirDoHistorico(item) {
  listaHistorico.removeChild(item);
  salvarHistorico();
}

function limparHistorico() {
  listaHistorico.innerHTML = '';
  salvarHistorico();
}

document.getElementById('limpar-historico').addEventListener('click', limparHistorico);

function salvarHistorico() {
  const historico = Array.from(listaHistorico.children).map(li => li.querySelector('span').textContent.split(', ').map(Number));
  localStorage.setItem('historicoSorteios', JSON.stringify(historico));
}

function iniciarSomSuspense() {
  audioSuspense = new Audio('sounds/suspense.mp3');
  audioSuspense.loop = true;
  audioSuspense.volume = 0.5; // Ajuste o volume conforme necessário
  audioSuspense.play().catch(error => console.error('Erro ao reproduzir o som de suspense:', error));
}

function pararSomSuspense() {
  if (audioSuspense) {
    audioSuspense.pause();
    audioSuspense.currentTime = 0;
  }
}

function reproduzirSomFinal() {
  const audioFinal = new Audio('sounds/sorteio.mp3');
  audioFinal.volume = 0.7; // Ajuste o volume conforme necessário
  audioFinal.play().catch(error => console.error('Erro ao reproduzir o som final:', error));
}

window.addEventListener('load', () => {
  const historico = JSON.parse(localStorage.getItem('historicoSorteios')) || [];
  historico.forEach(numeros => adicionarAoHistorico(numeros));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement === botaoSortear) {
    sortearNumeros();
  }
});