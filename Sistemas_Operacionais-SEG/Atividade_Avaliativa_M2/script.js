javascript
let quantum = 0;
let ramSize = 0;
let ioPenalty = 0;

let tempo = 0;

let processos = [];
let filaProntos = [];
let bloqueados = [];
let ram = [];

let cpuAtual = null;
let simulacaoRodando = false;

class Processo {

    constructor(nome, chegada, paginas) {

        this.nome = nome;
        this.chegada = chegada;
        this.paginas = paginas;

        this.paginaAtual = 0;

        this.quantumRestante = 0;

        this.pageFaults = 0;

        this.bloqueadoAte = -1;

        this.finalizado = false;

        this.tempoFinalizacao = 0;
    }
}

function iniciarSimulacao() {

    const input = document.getElementById("arquivoInput");

    if (!input.files[0]) {
        alert("Selecione um arquivo TXT");
        return;
    }

    resetarSimulacao();

    const reader = new FileReader();

    reader.onload = function(e) {

        const conteudo = e.target.result;

        lerArquivo(conteudo);

        simulacaoRodando = true;

        adicionarLog("Simulação iniciada");

        loopSimulacao();
    }

    reader.readAsText(input.files[0]);
}

function resetarSimulacao() {

    quantum = 0;
    ramSize = 0;
    ioPenalty = 0;

    tempo = 0;

    processos = [];
    filaProntos = [];
    bloqueados = [];
    ram = [];

    cpuAtual = null;

    document.getElementById("logs").innerHTML = "";
    document.getElementById("relatorio").innerHTML = "";
}

function lerArquivo(texto) {

    const linhas = texto.trim().split("\n");

    const primeiraLinha = linhas[0].split(" ");

    quantum = parseInt(primeiraLinha[0]);
    ramSize = parseInt(primeiraLinha[1]);
    ioPenalty = parseInt(primeiraLinha[2]);

    for (let i = 1; i < linhas.length; i++) {

        const partes = linhas[i].split(" ");

        const chegada = parseInt(partes[0]);

        const nome = partes[1];

        const paginas = partes[2]
            .split(",")
            .map(Number);

        processos.push(
            new Processo(nome, chegada, paginas)
        );
    }
}

function loopSimulacao() {

    const intervalo = setInterval(() => {

        if (!simulacaoRodando) {
            clearInterval(intervalo);
            return;
        }

        tick();

        atualizarTela();

        verificarFim();

    }, 1000);
}

function tick() {

    adicionarLog(`===== TEMPO ${tempo} =====`);

    verificarChegadas();

    verificarDesbloqueados();

    if (cpuAtual === null && filaProntos.length > 0) {

        cpuAtual = filaProntos.shift();

        cpuAtual.quantumRestante = quantum;

        adicionarLog(`${cpuAtual.nome} entrou na CPU`);
    }

    if (cpuAtual !== null) {

        executarProcesso(cpuAtual);
    }

    tempo++;
}

function verificarChegadas() {

    processos.forEach(processo => {

        if (processo.chegada === tempo) {

            filaProntos.push(processo);

            adicionarLog(`${processo.nome} chegou no sistema`);
        }
    });
}

function verificarDesbloqueados() {

    for (let i = bloqueados.length - 1; i >= 0; i--) {

        if (bloqueados[i].bloqueadoAte <= tempo) {

            adicionarLog(`${bloqueados[i].nome} voltou para fila de prontos`);

            filaProntos.push(bloqueados[i]);

            bloqueados.splice(i, 1);
        }
    }
}

function executarProcesso(processo) {

    if (processo.paginaAtual >= processo.paginas.length) {

        processo.finalizado = true;

        processo.tempoFinalizacao = tempo;

        adicionarLog(`${processo.nome} finalizou`);

        cpuAtual = null;

        return;
    }

    const pagina = processo.paginas[processo.paginaAtual];

    const paginaNaRam = ram.find(p => p.numero === pagina);

    if (paginaNaRam) {

        paginaNaRam.ultimoUso = tempo;

        adicionarLog(`${processo.nome} acessou página ${pagina} (HIT)`);

        processo.paginaAtual++;

        processo.quantumRestante--;
    }
    else {

        adicionarLog(`${processo.nome} sofreu PAGE FAULT na página ${pagina}`);

        processo.pageFaults++;

        carregarPagina(pagina);

        processo.bloqueadoAte = tempo + ioPenalty;

        bloqueados.push(processo);

        cpuAtual = null;

        return;
    }

    if (processo.quantumRestante <= 0) {

        adicionarLog(`${processo.nome} saiu da CPU (fim quantum)`);

        filaProntos.push(processo);

        cpuAtual = null;
    }
}

function carregarPagina(numeroPagina) {

    if (ram.length >= ramSize) {

        let lru = ram[0];

        ram.forEach(pagina => {

            if (pagina.ultimoUso < lru.ultimoUso) {
                lru = pagina;
            }
        });

        adicionarLog(`LRU removeu página ${lru.numero}`);

        ram = ram.filter(p => p.numero !== lru.numero);
    }

    ram.push({
        numero: numeroPagina,
        ultimoUso: tempo
    });

    adicionarLog(`Página ${numeroPagina} carregada na RAM`);
}

function atualizarTela() {

    document.getElementById("tempo").innerText = tempo;

    document.getElementById("cpu").innerText =
        cpuAtual ? cpuAtual.nome : "Nenhum";

    atualizarRAM();

    atualizarFilaProntos();

    atualizarBloqueados();
}

function atualizarRAM() {

    const div = document.getElementById("ram");

    div.innerHTML = "";

    ram.forEach(pagina => {

        div.innerHTML += `
            <div class="ram-item">
                ${pagina.numero}
            </div>
        `;
    });
}

function atualizarFilaProntos() {

    const div = document.getElementById("prontos");

    div.innerHTML = "";

    filaProntos.forEach(processo => {

        div.innerHTML += `
            <div class="process-item">
                ${processo.nome}
            </div>
        `;
    });
}

function atualizarBloqueados() {

    const div = document.getElementById("bloqueados");

    div.innerHTML = "";

    bloqueados.forEach(processo => {

        div.innerHTML += `
            <div class="process-item bloqueado">
                ${processo.nome}
            </div>
        `;
    });
}

function adicionarLog(texto) {

    const logs = document.getElementById("logs");

    logs.innerHTML += `
        <div class="log">
            ${texto}
        </div>
    `;

    logs.scrollTop = logs.scrollHeight;
}

function verificarFim() {

    const ativos = processos.filter(p => !p.finalizado);

    if (ativos.length === 0) {

        simulacaoRodando = false;

        gerarRelatorio();

        adicionarLog("Simulação finalizada");
    }
}

function gerarRelatorio() {

    const div = document.getElementById("relatorio");

    div.innerHTML = "";

    processos.forEach(processo => {

        const turnaround = processo.tempoFinalizacao - processo.chegada;

        div.innerHTML += `
            <p>
                <strong>${processo.nome}</strong><br>
                Tempo de Retorno: ${turnaround}<br>
                Page Faults: ${processo.pageFaults}
            </p>
            <hr>
        `;
    });
}
