document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    document.querySelector(".btnAdcionar").addEventListener("click", adicionarRegistro);
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);
});

function adicionarRegistro() {
    const setor = document.getElementById("setor").value;
    const funcionario = document.getElementById("funcionario").value;
    const codOrigem = document.getElementById("codOrigem").value;
    const descOrigem = document.getElementById("descOrigem").value;
    const quantOrigem = document.getElementById("quantOrigem").value;
    const codDestino = document.getElementById("codDestino").value;
    const descDestino = document.getElementById("descDestino").value;
    const quantDestino = document.getElementById("quantDestino").value;
    const data = document.getElementById("data").value;

    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !data) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data);
    document.querySelector("#tabela tbody").appendChild(novaLinha);

    salvarDados();

    // Limpa os campos do formulário
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

function salvarDados() {
    const dados = [];
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td");
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
        });
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    const tbody = document.querySelector("#tabela tbody");
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino, row.data);
        tbody.appendChild(novaLinha);
    });
}

function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data) {
    const novaLinha = document.createElement("tr");
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", quantDestino || "---", data];

    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto;
        novaLinha.appendChild(celula);
    });

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", function () {
        this.closest("tr").remove();
        salvarDados();
    });

    const celulaAcao = document.createElement("td");
    celulaAcao.appendChild(btnRemover);
    novaLinha.appendChild(celulaAcao);

    return novaLinha;
}

function exportarXLS() {
    const tabela = document.getElementById("tabela");
    const ws = XLSX.utils.table_to_sheet(tabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, "controle_estoque.xlsx");
}

function gerarPDF() {
    // Cria um novo documento PDF
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

    // Prepara os dados da tabela
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
        rows.push(rowData);
    });

    // Adiciona a tabela ao PDF
    doc.autoTable({
        head: [headers],
        body: rows,
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

    // Salva o PDF
    doc.save("remanejamento_de_estoque_padaria.pdf");
}