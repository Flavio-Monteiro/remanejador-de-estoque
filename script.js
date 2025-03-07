// Quando o documento HTML estiver completamente carregado, executa as funções abaixo
document.addEventListener("DOMContentLoaded", function () {
    carregarDados(); // Carrega os dados salvos no localStorage
    document.querySelector(".btnAdcionar").addEventListener("click", adicionarRegistro); // Adiciona evento de clique ao botão "Adicionar"
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF); // Adiciona evento de clique ao botão "Exportar PDF"
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS); // Adiciona evento de clique ao botão "Exportar para Excel"
});

let linhaEditando = null; // Variável para armazenar a linha que está sendo editada

// Função para adicionar um novo registro na tabela
function adicionarRegistro() {
    // Obtém os valores dos campos do formulário
    const setor = document.getElementById("setor").value;
    const funcionario = document.getElementById("funcionario").value;
    const codOrigem = document.getElementById("codOrigem").value;
    const descOrigem = document.getElementById("descOrigem").value;
    const quantOrigem = document.getElementById("quantOrigem").value;
    const codDestino = document.getElementById("codDestino").value;
    const descDestino = document.getElementById("descDestino").value;
    const quantDestino = document.getElementById("quantDestino").value;
    const data = document.getElementById("data").value;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !data) {
        alert("Preencha todos os campos obrigatórios!");
        return; // Se algum campo obrigatório estiver vazio, exibe um alerta e interrompe a função
    }

    // Cria uma nova linha na tabela com os dados do formulário
    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data);
    document.querySelector("#tabela tbody").appendChild(novaLinha); // Adiciona a nova linha à tabela

    salvarDados(); // Salva os dados no localStorage

    // Limpa os campos do formulário após adicionar o registro
    document.getElementById("setor").value = "";
    document.getElementById("funcionario").value = "";
    document.getElementById("codOrigem").value = "";
    document.getElementById("descOrigem").value = "";
    document.getElementById("quantOrigem").value = "";
    document.getElementById("codDestino").value = "";
    document.getElementById("descDestino").value = "";
    document.getElementById("quantDestino").value = "";
    document.getElementById("data").value = "";
}

// Função para salvar os dados da tabela no localStorage
function salvarDados() {
    const dados = []; // Array para armazenar os dados da tabela
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td"); // Obtém as células da linha
        dados.push({
            setor: celulas[0].textContent,
            funcionario: celulas[1].textContent,
            codOrigem: celulas[2].textContent,
            descOrigem: celulas[3].textContent,
            quantOrigem: celulas[4].textContent,
            codDestino: celulas[5].textContent,
            descDestino: celulas[6].textContent,
            quantDestino: celulas[7].textContent,
            data: celulas[8].textContent
        }); // Adiciona os dados da linha ao array
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados)); // Salva o array no localStorage
}

// Função para carregar os dados do localStorage na tabela
function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || []; // Obtém os dados do localStorage ou um array vazio
    const tbody = document.querySelector("#tabela tbody"); // Obtém o corpo da tabela
    dados.forEach(row => {
        // Cria uma nova linha na tabela para cada registro salvo
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino, row.data);
        tbody.appendChild(novaLinha); // Adiciona a linha à tabela
    });
}

// Função para criar uma nova linha na tabela
function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data) {
    const novaLinha = document.createElement("tr"); // Cria uma nova linha (<tr>)
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", quantDestino || "---", data]; // Array com os valores das células

    // Para cada valor, cria uma célula (<td>) e adiciona à linha
    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto;
        novaLinha.appendChild(celula);
    });

    // Cria o botão "Editar" e adiciona um evento de clique
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
        editarRegistro(this.closest("tr")); // Chama a função para editar a linha
    });

    // Cria o botão "Remover" e adiciona um evento de clique
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", function () {
        this.closest("tr").remove(); // Remove a linha da tabela
        salvarDados(); // Atualiza os dados no localStorage
    });

    // Cria a célula de ação e adiciona os botões "Editar" e "Remover"
    const celulaAcao = document.createElement("td");
    celulaAcao.appendChild(btnEditar);
    celulaAcao.appendChild(btnRemover);
    novaLinha.appendChild(celulaAcao); // Adiciona a célula de ação à linha

    return novaLinha; // Retorna a linha criada
}

// Função para editar um registro
function editarRegistro(linha) {
    linhaEditando = linha; // Armazena a linha que está sendo editada
    const celulas = linha.querySelectorAll("td"); // Obtém as células da linha

    // Preenche o formulário de edição com os valores da linha
    document.getElementById("editSetor").value = celulas[0].textContent;
    document.getElementById("editFuncionario").value = celulas[1].textContent;
    document.getElementById("editCodOrigem").value = celulas[2].textContent;
    document.getElementById("editDescOrigem").value = celulas[3].textContent;
    document.getElementById("editQuantOrigem").value = celulas[4].textContent;
    document.getElementById("editCodDestino").value = celulas[5].textContent;
    document.getElementById("editDescDestino").value = celulas[6].textContent;
    document.getElementById("editQuantDestino").value = celulas[7].textContent;
    document.getElementById("editData").value = celulas[8].textContent;

    document.getElementById("formEdicao").style.display = "block"; // Exibe o formulário de edição
}

// Função para salvar as alterações feitas no formulário de edição
function salvarEdicao() {
    const celulas = linhaEditando.querySelectorAll("td"); // Obtém as células da linha que está sendo editada

    // Atualiza os valores da linha com os dados do formulário de edição
    celulas[0].textContent = document.getElementById("editSetor").value;
    celulas[1].textContent = document.getElementById("editFuncionario").value;
    celulas[2].textContent = document.getElementById("editCodOrigem").value;
    celulas[3].textContent = document.getElementById("editDescOrigem").value;
    celulas[4].textContent = document.getElementById("editQuantOrigem").value;
    celulas[5].textContent = document.getElementById("editCodDestino").value;
    celulas[6].textContent = document.getElementById("editDescDestino").value;
    celulas[7].textContent = document.getElementById("editQuantDestino").value;
    celulas[8].textContent = document.getElementById("editData").value;

    salvarDados(); // Salva os dados atualizados no localStorage
    cancelarEdicao(); // Oculta o formulário de edição
}

// Função para cancelar a edição e ocultar o formulário de edição
function cancelarEdicao() {
    document.getElementById("formEdicao").style.display = "none"; // Oculta o formulário de edição
    linhaEditando = null; // Limpa a referência da linha que estava sendo editada
}

// Função para exportar a tabela para um arquivo Excel
function exportarXLS() {
    const tabela = document.getElementById("tabela"); // Obtém a tabela
    const ws = XLSX.utils.table_to_sheet(tabela); // Converte a tabela para uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Registros"); // Adiciona a planilha ao livro
    XLSX.writeFile(wb, "controle_estoque.xlsx"); // Exporta o arquivo Excel
}

// Função para gerar um PDF com os dados da tabela
function gerarPDF() {
    const doc = new jspdf.jsPDF({
        orientation: "landscape", // Orientação paisagem
        unit: "mm",
        format: "a4",
    });

    // Adiciona o título ao PDF
    doc.setFontSize(18);
    doc.text("Relatório de Remanejamento de Estoque de Pães", 15, 20);

    // Adiciona a data atual ao PDF
    const hoje = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataAtual = `Data: ${hoje.toLocaleDateString('pt-BR', options)}`;
    doc.setFontSize(12);
    doc.text(dataAtual, doc.internal.pageSize.width - 15, 20, { align: "right" });

    // Prepara os dados da tabela para o PDF
    const headers = [
        "Setor",
        "Funcionário",
        "Código de Retirada",
        "Produto Retirado",
        "Quantidade Retirada",
        "Código de Produção",
        "Produto de Produção",
        "Quantidade para Produção",
        "Data"
    ];

    const rows = [];
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td");
        const rowData = [];
        celulas.forEach((celula, index) => {
            if (index < 9) { // Ignora a coluna de ação (índice 9)
                rowData.push(celula.textContent);
            }
        });
        rows.push(rowData); // Adiciona os dados da linha ao array
    });

    // Adiciona a tabela ao PDF
    doc.autoTable({
        head: [headers], // Cabeçalho da tabela
        body: rows, // Dados da tabela
        startY: 30, // Posição inicial da tabela
        theme: "grid", // Estilo da tabela
        styles: {
            fontSize: 8, // Tamanho da fonte
            cellPadding: 2, // Espaçamento interno das células
            textColor: [0, 0, 0], // Cor da fonte (preto)
        },
        headStyles: {
            fillColor: [51, 51, 51], // Cor de fundo do cabeçalho (cinza escuro)
            textColor: [255, 255, 255], // Cor da fonte do cabeçalho (branco)
            fontSize: 12, // Tamanho da fonte do cabeçalho
            cellPadding: 2, // Espaçamento interno do cabeçalho
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245], // Cor de fundo das linhas alternadas
        },
        margin: { top: 20 }, // Margem superior
    });

    doc.save("remanejamento_de_estoque_padaria.pdf"); // Salva o PDF
}