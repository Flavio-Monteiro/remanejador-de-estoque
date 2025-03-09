const produtos = {
    "7897261800011": {
        descricao: "Açúcar Caeté",
        codigoDestino: "217018",
        descricaoDestino: "açúcar produção"
    },
    "7896110100012": {
        descricao: "Sal 1",
        codigoDestino: "217000",
        descricaoDestino: "sal produção"
    },
    "290815": {
        descricao: "óleo",
        codigoDestino: "290815",
        descricaoDestino: "óleo produção"
    },
    "290858": {
        descricao: "Leite em pó",
        codigoDestino: "290858",
        descricaoDestino: "leite em pó prod."
    },
    "290866": {
        descricao: "Leite líquido",
        codigoDestino: "290866",
        descricaoDestino: "leite líquido prod."
    },
    "290793": {
        descricao: "Creme de leite",
        codigoDestino: "290793",
        descricaoDestino: "creme de leite prod."
    },
    "7896215300980": {
        descricao: "Leite de coco 01",
        codigoDestino: "264580",
        descricaoDestino: "leite de coco prod."
    },
    "7896215300065": {
        descricao: "Leite de coco 02",
        codigoDestino: "264580",
        descricaoDestino: "leite de coco prod."
    },
    "7896012701218": {
        descricao: "Gelo",
        codigoDestino: "292524",
        descricaoDestino: "gelo produção"
    },
    "0751320014788": {
        descricao: "Ovos galinha",
        codigoDestino: "290840",
        descricaoDestino: "ovos galinha produção"
    },
    "965491": {
        descricao: "Coco seco",
        codigoDestino: "965491",
        descricaoDestino: "Coco seco produção"
    },
    "246810":{
        descricao: "Prod Novo",
        codigoDestino: "123456",
        descricaoDestino: "Prod. novo produ"
    }
};

document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    document.querySelector(".btnAdcionar").addEventListener("click", adicionarRegistro);
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);

    // Evento para preencher automaticamente os campos ao digitar o código de origem
    document.getElementById("codOrigem").addEventListener("input", function () {
        const codigo = this.value;
        const produto = produtos[codigo];

        if (produto) {
            document.getElementById("descOrigem").value = produto.descricao;
            document.getElementById("codDestino").value = produto.codigoDestino;
            document.getElementById("descDestino").value = produto.descricaoDestino;
        } else {
            if (this.value === "") {
                document.getElementById("descOrigem").value = "";
                document.getElementById("codDestino").value = "";
                document.getElementById("descDestino").value = "";
            }
        }
    });

    // Evento para preencher automaticamente o "Código de Origem" ao selecionar o produto retirado
    document.getElementById("descOrigem").addEventListener("input", function () {
        const descricaoCompleta = this.value;
        const nomeProduto = descricaoCompleta.split(" - ")[1];

        if (nomeProduto) {
            const codigo = Object.keys(produtos).find(key => produtos[key].descricao === nomeProduto);
            const produto = produtos[codigo];

            if (produto) {
                document.getElementById("codOrigem").value = codigo;
                document.getElementById("descOrigem").value = nomeProduto;
                document.getElementById("codDestino").value = produto.codigoDestino;
                document.getElementById("descDestino").value = produto.descricaoDestino;
            }
        } else {
            if (this.value === "") {
                document.getElementById("codOrigem").value = "";
                document.getElementById("descOrigem").value = "";
                document.getElementById("codDestino").value = "";
                document.getElementById("descDestino").value = "";
            }
        }
    });
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
    const data = document.getElementById("data").value;
    const observacao = document.getElementById("observacao").value;

    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !data) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, data, observacao);
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
    document.getElementById("data").value = "";
    document.getElementById("observacao").value = "";
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
            data: celulas[7].textContent,
            observacao: celulas[8].textContent
        });
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    const tbody = document.querySelector("#tabela tbody");
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.data, row.observacao);
        tbody.appendChild(novaLinha);
    });
}

function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, data, observacao) {
    const novaLinha = document.createElement("tr");
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", data, observacao || "---"];

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
    document.getElementById("editData").value = celulas[7].textContent;
    document.getElementById("editObservacao").value = celulas[8].textContent;

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
    celulas[7].textContent = document.getElementById("editData").value;
    celulas[8].textContent = document.getElementById("editObservacao").value;

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

    // Adicionar a logo
    const logo = "logoPontoCerto.jpg"; // Caminho da logo
    doc.addImage(logo, "PNG", 15, 10, 30, 15); // Ajuste a posição e o tamanho da logo

    // Título do relatório
    doc.setFontSize(18);
    doc.text("Solicitação de Remanejamento de Estoque", 50, 20); // Ajuste a posição do título

    // Data atual
    const hoje = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataAtual = `Data: ${hoje.toLocaleDateString('pt-BR', options)}`;
    doc.setFontSize(12);
    doc.text(dataAtual, doc.internal.pageSize.width - 15, 20, { align: "right" });

    // Cabeçalhos da tabela
    const headers = [
        "Setor",
        "Funcionário",
        "Código de Retirada",
        "Produto Retirado",
        "Quantidade Retirada",
        "Código de Produção",
        "Produto de Produção",
        "Data",
        "Observação"
    ];

    // Dados da tabela
    const rows = [];
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        const celulas = linha.querySelectorAll("td");
        const rowData = [];
        celulas.forEach((celula, index) => {
            if (index < 9) {
                rowData.push(celula.textContent);
            }
        });
        rows.push(rowData);
    });

    // Criar a tabela
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 30, // Ajuste a posição Y da tabela
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

    // Salvar o PDF
    doc.save("solicitacao_remanejamento_estoque.pdf");
}