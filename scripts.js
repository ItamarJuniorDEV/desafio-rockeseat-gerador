// Seleção dos elementos HTML necessários para a aplicação
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

let audioSuspense; // Variável para controle do som de suspense

// Evento de submit do formulário para iniciar o sorteio dos números
sorteadorForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita o comportamento padrão de recarregar a página
  sortearNumeros(); // Chama a função de sorteio
});

// Alterna o tema da página entre claro e escuro
toggleThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

// Função principal para sortear os números
function sortearNumeros() {
  // Verifica se todos os campos estão preenchidos
  if (quantidadeNumeros.value === '' || numeroMin.value === '' || numeroMax.value === '') {
    alert('Por favor, preencha todos os campos.');
    return; // Interrompe a execução se algum campo estiver vazio
  }

  // Converte os valores de entrada para inteiros
  const quantidade = parseInt(quantidadeNumeros.value);
  const min = parseInt(numeroMin.value);
  const max = parseInt(numeroMax.value);
  const repetir = !naoRepetir.checked; // Define se números podem se repetir

  // Valida se o número mínimo é menor que o número máximo
  if (min > max) {
    alert('O número mínimo deve ser menor que o número máximo.');
    return;
  }

  // Verifica se é possível sortear a quantidade de números solicitada sem repetição
  if (!repetir && (max - min + 1) < quantidade) {
    alert('Não é possível sortear essa quantidade de números sem repetição no intervalo especificado.');
    return;
  }

  // Realiza o sorteio dos números e exibe o resultado
  const numeros = sortearNumerosUnicos(quantidade, min, max, repetir);
  exibirNumerosSorteados(numeros);
  adicionarAoHistorico(numeros);
}

// Função para gerar uma lista de números únicos sorteados
function sortearNumerosUnicos(quantidade, min, max, repetir) {
  const numeros = new Set(); // Utiliza Set para evitar duplicações
  while (numeros.size < quantidade) {
    const numero = Math.floor(Math.random() * (max - min + 1)) + min; // Sorteio aleatório
    if (repetir || !numeros.has(numero)) {
      numeros.add(numero); // Adiciona o número ao conjunto se for permitido repetir ou se não estiver presente
    }
  }
  
  return Array.from(numeros); // Converte o Set para um array e retorna
}

// Função para exibir os números sorteados na tela com efeito de suspense
function exibirNumerosSorteados(numeros) {
  numerosSorteados.textContent = 'Sorteando...'; // Texto inicial enquanto os números são revelados
  botaoSortear.disabled = true; // Desabilita o botão de sorteio durante o processo

  iniciarSomSuspense(); // Inicia o som de suspense

  let indice = 0;
  const intervalId = setInterval(() => {
    if (indice < numeros.length) {
      // Atualiza a exibição dos números progressivamente
      numerosSorteados.textContent = numeros.slice(0, indice + 1).join(', ');
      indice++;
    } else {
      clearInterval(intervalId); // Interrompe o intervalo ao final do sorteio
      finalizarSorteio(); // Chama a função para finalizar o sorteio
    }
  }, 500); // Intervalo de 0.5 segundo entre cada número
}

// Função para finalizar o sorteio
function finalizarSorteio() {
  botaoSortear.disabled = false; // Reativa o botão de sorteio
  numerosSorteados.classList.add('resultado-final'); // Adiciona efeito visual aos números sorteados
  setTimeout(() => numerosSorteados.classList.remove('resultado-final'), 1000); // Remove o efeito após 1 segundo
  pararSomSuspense(); // Para o som de suspense
}

// Adiciona o resultado atual ao histórico de sorteios
function adicionarAoHistorico(numeros) {
  const li = document.createElement('li');
  
  // Formatação da data e hora do sorteio
  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Criação dos elementos de data e números sorteados
  const dataSpan = document.createElement('span');
  dataSpan.classList.add('data-hora');
  dataSpan.textContent = dataHora;
  
  const numerosSpan = document.createElement('span');
  numerosSpan.classList.add('numeros');
  numerosSpan.textContent = numeros.join(', ');

  // Botão para excluir o item do histórico
  const btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.classList.add('btn-excluir');
  btnExcluir.addEventListener('click', () => excluirDoHistorico(li));

  // Adiciona os elementos ao item da lista
  li.appendChild(dataSpan);
  li.appendChild(numerosSpan);
  li.appendChild(btnExcluir);
  listaHistorico.insertBefore(li, listaHistorico.firstChild);

  // Limita o histórico a 10 itens
  if (listaHistorico.children.length > 10) {
    listaHistorico.removeChild(listaHistorico.lastChild);
  }

  salvarHistorico(); // Salva o histórico atualizado
}

// Remove um item específico do histórico
function excluirDoHistorico(item) {
  listaHistorico.removeChild(item);
  salvarHistorico(); // Atualiza o armazenamento do histórico
}

// Limpa todo o histórico de sorteios
function limparHistorico() {
  listaHistorico.innerHTML = '';
  salvarHistorico(); // Atualiza o armazenamento do histórico
}

// Evento para limpar o histórico ao clicar no botão correspondente
document.getElementById('limpar-historico').addEventListener('click', limparHistorico);

// Salva o histórico de sorteios no armazenamento local
function salvarHistorico() {
  const historico = Array.from(listaHistorico.children).map(li => {
    const dataHora = li.querySelector('.data-hora').textContent;
    const numeros = li.querySelector('.numeros').textContent;
    return `${dataHora} - ${numeros}`;
  });
  localStorage.setItem('historicoSorteios', JSON.stringify(historico));
}

// Inicia o som de suspense para o sorteio
function iniciarSomSuspense() {
  audioSuspense = new Audio('sounds/sorteio.mp3');
  audioSuspense.loop = true;
  audioSuspense.volume = 0.25; 
  audioSuspense.play().catch(error => console.error('Erro ao reproduzir o som:', error));
}

// Para o som de suspense
function pararSomSuspense() {
  if (audioSuspense) {
    audioSuspense.pause();
    audioSuspense.currentTime = 0;
  }
}

// Carrega o histórico de sorteios ao carregar a página
window.addEventListener('load', () => {
  const historico = JSON.parse(localStorage.getItem('historicoSorteios')) || [];
  historico.forEach(item => {
    const li = document.createElement('li');
    const [dataHora, numeros] = item.split(' - ');

    // Criação dos elementos de data e números para o histórico
    const dataSpan = document.createElement('span');
    dataSpan.classList.add('data-hora');
    dataSpan.textContent = dataHora;

    const numerosSpan = document.createElement('span');
    numerosSpan.classList.add('numeros');
    numerosSpan.textContent = numeros;

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.addEventListener('click', () => excluirDoHistorico(li));

    // Adiciona os elementos ao item da lista
    li.appendChild(dataSpan);
    li.appendChild(numerosSpan);
    li.appendChild(btnExcluir);
    listaHistorico.appendChild(li);
  });
});
