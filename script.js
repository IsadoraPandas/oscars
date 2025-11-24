let cardContainer = document.querySelector(".card-container");
let carrossel = document.querySelector(".carrossel");
let campoBusca = document.querySelector("header input");
let dados = [];
let streamings = [];

async function iniciarBusca() {
    // Se os dados ainda não foram carregados, busca do JSON.
    carrossel.remove();
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; // Interrompe a execução se houver erro
        }
    }
    if (streamings.length === 0) {
        try {
            let resposta2 = await fetch("datastreamings.json");
            streamings = await resposta2.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; // Interrompe a execução se houver erro
        }
    }
    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.sinopse.toLowerCase().includes(termoBusca) ||
        dado.diretor.toLowerCase().includes(termoBusca) ||
        dado.melhoratriz.toLowerCase().includes(termoBusca)
    );
    
    renderizarCards(dadosFiltrados,streamings);
}

function renderizarCards(dados, streamings) {
    
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos    
    for (let dado of dados) {
        
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome} (${dado.ano})</h2>
        <h3>${dado.diretor}</h3>
        <img id="poster" src="${dado.poster}" alt="${dado.nome}">        
        <p id="nota"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1009px-Rotten_Tomatoes.svg.png" alt = "Rotten Tomatoes"> Crítica: ${dado.rottenTomatoes.critics}% — Público: ${dado.rottenTomatoes.audience}%</p>
        <p id="duracao&classificacao">Duração: ${dado.duracao} min — Classificação: ${dado.classificacao}</p>
        <p id="atores">Elenco principal: ${dado.atores}</p>
        <p id="sinopsetitulo">Sinopse:</p>
        <p id="sinopse">${dado.sinopse}</p>
        <p id="streaming">Disponível em: ${dado.streaming}</p>
        <a href="${dado.link}" target="_blank">Leia reviews do filme no Letterboxd</a>
        `;
        cardContainer.appendChild(article);
        
    }
}

const indicadores = document.querySelectorAll(".indicador");
const radios = document.querySelectorAll("input[type='radio']");
let qual = 0;
let temporizador;

for (let i=0; i < indicadores.length; i++) {
    indicadores[i].addEventListener("click", mudarSlide);
    indicadores[i].setAttribute("indice", i);
}

function mudarSlide(event)
{
    event.preventDefault();

    clearInterval(temporizador);

    for (let i=0; i < radios.length; i++)
    { 
        radios[i].removeAttribute("checked");
    }

    qual = this.getAttribute("indice");
    radios[qual].setAttribute("checked", "checked");

    for (let i=0; i < indicadores.length; i++){
        if (i==qual)
            indicadores[i].classList.add("ativo");
        else
            indicadores[i].classList.remove("ativo");
    }  

    setTimeout(iniciarTemporizador, 5000);
}

function mudarAutomatico()
{
    qual++;
    if (qual == 10)
        qual = 0;

    for (let i=0; i < radios.length; i++)
    { 
        radios[i].removeAttribute("checked");
    }

    radios[qual].setAttribute("checked", "checked");

    for (let i=0; i < indicadores.length; i++){
        if (i==qual)
            indicadores[i].classList.add("ativo");
        else
            indicadores[i].classList.remove("ativo");
    }  
}

function iniciarTemporizador()
{
    temporizador = setInterval(mudarAutomatico, 5000);
}

iniciarTemporizador();