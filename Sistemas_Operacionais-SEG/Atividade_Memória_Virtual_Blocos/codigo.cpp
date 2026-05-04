#include <iostream>
using namespace std;

#define NUM_PAGINAS 5
#define NUM_FRAMES 3

// Estrutura de uma entrada da tabela de paginas
struct Pagina {
    int numeroPagina;
    int frame;
    bool valido;
};

// Memoria fisica (frames)
int *memoriaFisica;

// Tabela de paginas (ponteiro)
Pagina *tabelaPaginas;

// Inicialização
void inicializar() {
    memoriaFisica = new int[NUM_FRAMES];
    tabelaPaginas = new Pagina[NUM_PAGINAS];

    for (int i = 0; i < NUM_PAGINAS; i++) {
        tabelaPaginas[i].numeroPagina = i;
        tabelaPaginas[i].frame = -1;
        tabelaPaginas[i].valido = false;
    }

    for (int i = 0; i < NUM_FRAMES; i++) {
        memoriaFisica[i] = -1;
    }
}

// Procura frame livre
int encontrarFrameLivre() {
    for (int i = 0; i < NUM_FRAMES; i++) {
        if (memoriaFisica[i] == -1)
            return i;
    }
    return -1;
}

// Simulação do tratamento de Page Fault
void tratarPageFault(int pagina) {
    cout << ">> PAGE FAULT na pagina " << pagina << endl;

    int frameLivre = encontrarFrameLivre();

    if (frameLivre == -1) {
        cout << ">> Memoria cheia! Substituindo frame 0 (FIFO simples)\n";
        frameLivre = 0;
    }

    // Carrega pagina na memoria
    memoriaFisica[frameLivre] = pagina;

    // Atualiza tabela
    tabelaPaginas[pagina].frame = frameLivre;
    tabelaPaginas[pagina].valido = true;

    cout << ">> Pagina " << pagina << " carregada no frame " << frameLivre << endl;
}

// Acesso à memoria
void acessarPagina(int pagina) {
    cout << "\nAcessando pagina " << pagina << endl;

    if (tabelaPaginas[pagina].valido) {
        cout << ">> HIT! Pagina esta no frame "
             << tabelaPaginas[pagina].frame << endl;
    } else {
        tratarPageFault(pagina);
    }
}

// Exibir estado da memoria
void mostrarMemoria() {
    cout << "\nMemoria Fisica:\n";
    for (int i = 0; i < NUM_FRAMES; i++) {
        cout << "Frame " << i << ": " << memoriaFisica[i] << endl;
    }
}

// Main
int main() {
    inicializar();

    acessarPagina(0);
    acessarPagina(1);
    acessarPagina(2);
    acessarPagina(0); // HIT
    acessarPagina(3); // PAGE FAULT + substituição

    mostrarMemoria();

    delete[] memoriaFisica;
    delete[] tabelaPaginas;

    return 0;
}