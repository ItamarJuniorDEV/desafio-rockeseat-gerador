const quantidadeNumeros = document.getElementById('quantidade');
const numeroMin = document.getElementById('numero-min');
const numeroMax = document.getElementById('numero-max');
const naoRepetir = document.getElementById('nao-repetir');
const resultado = document.getElementById('resultado');
const sorteadorForm = document.getElementById('sorteador-form');
const botaoSortear = document.getElementById('btn-sortear');
const numerosSorteados = document.getElementById('numeros-sorteados');

sorteadorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sortearNumeros();
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

  let indice = 0;
  const intervalId = setInterval(() => {
    if (indice < numeros.length) {
      numerosSorteados.textContent = numeros.slice(0, indice + 1).join(', ');
      indice++;
    } else {
      clearInterval(intervalId);
      botaoSortear.disabled = false;
    }
  }, 1000);
}