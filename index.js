document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const form = document.querySelector('.search-box');
    const input = form.querySelector('input[type="search"]');
    const resultsContainer = document.querySelector('.results');
    const resultsCounter = document.querySelector('header p');
    const historyButton = document.getElementById('history-button');
    const historyList = document.getElementById('history-list');
    const historyDiv = document.getElementById('history');
    const backButton = document.getElementById('back-button'); // Adiciona a seleção do botão "Voltar"

    // Esconde o histórico inicialmente
    historyDiv.style.display = 'none';

    // Evento de envio do formulário de pesquisa
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        const searchTerm = input.value.trim(); // Obtém o termo de pesquisa
        if (searchTerm) { // Se o termo não estiver vazio
            searchWikipedia(searchTerm); // Busca na Wikipedia
            addToHistory(searchTerm); // Adiciona ao histórico
        }
    });

    // Evento de clique no botão "Mostrar histórico"
    historyButton.addEventListener('click', () => {
        // Alterna a visibilidade do histórico
        historyDiv.style.display = historyDiv.style.display === 'none' ? 'block' : 'none';

        // Exibe o histórico se ele estiver visível
        if (historyDiv.style.display === 'block') {
            displayHistory();
        }
    });

    // Evento de clique no botão "Voltar"
    backButton.addEventListener('click', () => {
        window.history.back();
    });

    // Função para buscar na Wikipedia
    function searchWikipedia(searchTerm) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=500&srsearch=${encodeURIComponent(searchTerm)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayResults(data.query.search);
            })
            .catch(error => alert('Error: ' + error));
    }

    // Função para exibir os resultados da pesquisa
    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Limpa os resultados anteriores
        resultsCounter.textContent = `Contador de resultados: ${results.length}`;
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result';
            resultElement.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.snippet}</p>
                <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank">Leia Mais</a>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }

    // Função para adicionar ao histórico
    function addToHistory(searchTerm) {
        let searchHistory = new Set(JSON.parse(localStorage.getItem('searchHistory')) || []);
        searchHistory.add(searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify([...searchHistory]));
    }

    // Função para exibir o histórico
    function displayHistory() {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        historyList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

        // Se não houver histórico, exibe uma mensagem
        if (searchHistory.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Nenhum histórico encontrado.";
            historyList.appendChild(li);
        } else {
            // Para cada item no histórico, cria um elemento <li>
            searchHistory.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                historyList.appendChild(li);
            });
        }
    }
});