// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
    // Carrega os dados salvos no localStorage ao iniciar a página
    carregarDados();

    // Adiciona um evento de clique ao botão "Adicionar" para adicionar um novo registro
    document.getElementById("btnAdicionar").addEventListener("click", adicionarRegistro);

    // Adiciona um evento de clique ao botão "Exportar PDF" para gerar o PDF
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);

    // Adiciona um evento de clique ao botão "Exportar XLS" para exportar para Excel
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);
});

// Função para adicionar um novo registro à tabela
function adicionarRegistro() {
    // Obtém os valores dos campos de entrada
    const setor = document.getElementById("setor").value;
    const funcionario = document.getElementById("funcionario").value;
    const codOrigem = document.getElementById("codOrigem").value;
    const descOrigem = document.getElementById("descOrigem").value;
    const quantOrigem = document.getElementById("quantOrigem").value;
    const codDestino = document.getElementById("codDestino").value;
    const descDestino = document.getElementById("descDestino").value;
    const quantDestino = document.getElementById("quantDestino").value;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem) {
        alert("Preencha todos os campos obrigatórios!");
        return; // Interrompe a execução se algum campo obrigatório estiver vazio
    }

    // Cria uma nova linha na tabela com os dados fornecidos
    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino);

    // Adiciona a nova linha ao corpo da tabela
    document.querySelector("#tabela tbody").appendChild(novaLinha);

    // Salva os dados atualizados no localStorage
    salvarDados();

    // Limpa os campos do formulário após a adição do registro
    document.getElementById("setor").value = "";
    document.getElementById("funcionario").value = "";
    document.getElementById("codOrigem").value = "";
    document.getElementById("descOrigem").value = "";
    document.getElementById("quantOrigem").value = "";
    document.getElementById("codDestino").value = "";
    document.getElementById("descDestino").value = "";
    document.getElementById("quantDestino").value = "";
}

// Função para salvar os dados da tabela no localStorage
function salvarDados() {
    const dados = [];
    // Itera sobre cada linha da tabela
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td");
        // Armazena os dados de cada linha em um objeto
        dados.push({
            setor: celulas[0].textContent,
            funcionario: celulas[1].textContent,
            codOrigem: celulas[2].textContent,
            descOrigem: celulas[3].textContent,
            quantOrigem: celulas[4].textContent,
            codDestino: celulas[5].textContent,
            descDestino: celulas[6].textContent,
            quantDestino: celulas[7].textContent
        });
    });
    // Salva os dados no localStorage como uma string JSON
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

// Função para carregar os dados salvos no localStorage
function carregarDados() {
    // Obtém os dados do localStorage ou usa um array vazio se não houver dados
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    const tbody = document.querySelector("#tabela tbody");
    // Itera sobre os dados e cria uma linha na tabela para cada registro
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino);
        tbody.appendChild(novaLinha);
    });
}

// Função para criar uma nova linha na tabela
function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino) {
    const novaLinha = document.createElement("tr");
    // Array com os valores das células da linha
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", quantDestino || "---"];

    // Itera sobre os valores e cria as células da linha
    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto;
        novaLinha.appendChild(celula);
    });

    // Cria um botão "Remover" para a linha
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", function () {
        // Remove a linha ao clicar no botão
        this.closest("tr").remove();
        // Atualiza os dados no localStorage após a remoção
        salvarDados();
    });

    // Adiciona o botão "Remover" à última célula da linha
    const celulaAcao = document.createElement("td");
    celulaAcao.appendChild(btnRemover);
    novaLinha.appendChild(celulaAcao);

    return novaLinha; // Retorna a linha criada
}

// Função para exportar a tabela para um arquivo Excel (XLS)
function exportarXLS() {
    const tabela = document.getElementById("tabela");
    // Converte a tabela para uma planilha do Excel
    const ws = XLSX.utils.table_to_sheet(tabela);
    const wb = XLSX.utils.book_new();
    // Adiciona a planilha ao livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    // Exporta o arquivo Excel com o nome "controle_estoque.xlsx"
    XLSX.writeFile(wb, "controle_estoque.xlsx");
}

// Função para gerar um PDF a partir da tabela
function gerarPDF() {
    // Clona a tabela para não modificar a original
    const tabela = document.getElementById("tabela").cloneNode(true);

    // Remove a coluna de ação (botão "Remover") de cada linha
    tabela.querySelectorAll("tr").forEach(linha => linha.removeChild(linha.lastElementChild));

    // Cria um container para o conteúdo do PDF
    const container = document.createElement("div");

    // Adiciona um título ao PDF
    const cabecalho = document.createElement("h2");
    cabecalho.textContent = "Relatório de Remanejamento de Estoque de Pães";
    cabecalho.style.textAlign = "center";
    cabecalho.style.marginBottom = "20px";
    container.appendChild(cabecalho);

    // Adiciona a data atual ao PDF
    const dataAtual = document.createElement("p");
    const hoje = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    dataAtual.textContent = `Data: ${hoje.toLocaleDateString('pt-BR', options)}`;
    dataAtual.style.textAlign = "right";
    dataAtual.style.marginBottom = "10px";
    container.appendChild(dataAtual);

    // Adiciona a tabela ao container
    container.appendChild(tabela);

    // Gera o PDF a partir do container
    html2pdf()
        .from(container)
        .set({
            margin: 10, // Define as margens do PDF
            filename: "controle_estoque.pdf", // Nome do arquivo PDF
            jsPDF: { orientation: "landscape" } // Orientação paisagem
        })
        .save(); // Salva o PDF
}