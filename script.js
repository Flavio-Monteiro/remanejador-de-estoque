document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    document.querySelector(".btnAdcionar").addEventListener("click", adicionarRegistro);
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);
});

let linhaEditando = null;

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
    const observacao = document.getElementById("observacao").value; // Novo campo de Observação

    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !data) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data, observacao);
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
    document.getElementById("observacao").value = ""; // Limpa o campo de Observação
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
            data: celulas[8].textContent,
            observacao: celulas[9].textContent // Novo campo de Observação
        });
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    const tbody = document.querySelector("#tabela tbody");
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino, row.data, row.observacao);
        tbody.appendChild(novaLinha);
    });
}

function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino, data, observacao) {
    const novaLinha = document.createElement("tr");
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", quantDestino || "---", data, observacao || "---"]; // Adiciona Observação

    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto;
        novaLinha.appendChild(celula);
    });

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
        editarRegistro(this.closest("tr"));
    });

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", function () {
        this.closest("tr").remove();
        salvarDados();
    });

    const celulaAcao = document.createElement("td");
    celulaAcao.appendChild(btnEditar);
    celulaAcao.appendChild(btnRemover);
    novaLinha.appendChild(celulaAcao);

    return novaLinha;
}

function editarRegistro(linha) {
    linhaEditando = linha;
    const celulas = linha.querySelectorAll("td");

    document.getElementById("editSetor").value = celulas[0].textContent;
    document.getElementById("editFuncionario").value = celulas[1].textContent;
    document.getElementById("editCodOrigem").value = celulas[2].textContent;
    document.getElementById("editDescOrigem").value = celulas[3].textContent;
    document.getElementById("editQuantOrigem").value = celulas[4].textContent;
    document.getElementById("editCodDestino").value = celulas[5].textContent;
    document.getElementById("editDescDestino").value = celulas[6].textContent;
    document.getElementById("editQuantDestino").value = celulas[7].textContent;
    document.getElementById("editData").value = celulas[8].textContent;
    document.getElementById("editObservacao").value = celulas[9].textContent; // Novo campo de Observação

    document.getElementById("formEdicao").style.display = "block";
}

function salvarEdicao() {
    const celulas = linhaEditando.querySelectorAll("td");

    celulas[0].textContent = document.getElementById("editSetor").value;
    celulas[1].textContent = document.getElementById("editFuncionario").value;
    celulas[2].textContent = document.getElementById("editCodOrigem").value;
    celulas[3].textContent = document.getElementById("editDescOrigem").value;
    celulas[4].textContent = document.getElementById("editQuantOrigem").value;
    celulas[5].textContent = document.getElementById("editCodDestino").value;
    celulas[6].textContent = document.getElementById("editDescDestino").value;
    celulas[7].textContent = document.getElementById("editQuantDestino").value;
    celulas[8].textContent = document.getElementById("editData").value;
    celulas[9].textContent = document.getElementById("editObservacao").value; // Novo campo de Observação

    salvarDados();
    cancelarEdicao();
}

function cancelarEdicao() {
    document.getElementById("formEdicao").style.display = "none";
    linhaEditando = null;
}

function exportarXLS() {
    const tabela = document.getElementById("tabela");
    const ws = XLSX.utils.table_to_sheet(tabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, "controle_estoque.xlsx");
}

function gerarPDF() {
    const doc = new jspdf.jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    doc.setFontSize(18);
    doc.text("Relatório de Remanejamento de Estoque de Pães", 15, 20);

    const hoje = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataAtual = `Data: ${hoje.toLocaleDateString('pt-BR', options)}`;
    doc.setFontSize(12);
    doc.text(dataAtual, doc.internal.pageSize.width - 15, 20, { align: "right" });

    const headers = [
        "Setor",
        "Funcionário",
        "Código de Retirada",
        "Produto Retirado",
        "Quantidade Retirada",
        "Código de Produção",
        "Produto de Produção",
        "Quantidade para Produção",
        "Data",
        "Observação" // Novo campo de Observação
    ];

    const rows = [];
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td");
        const rowData = [];
        celulas.forEach((celula, index) => {
            if (index < 10) { // Atualizado para incluir a Observação
                rowData.push(celula.textContent);
            }
        });
        rows.push(rowData);
    });

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        theme: "grid",
        styles: {
            fontSize: 8,
            cellPadding: 2,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [51, 51, 51],
            textColor: [255, 255, 255],
            fontSize: 12,
            cellPadding: 2,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        margin: { top: 20 },
    });

    doc.save("remanejamento_de_estoque_padaria.pdf");
}