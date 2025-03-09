// Banco de dados de produtos
const produtos = {
    "7897261800011": { descricao: "Açúcar Caeté",     codigoDestino: "217018", descricaoDestino: "Açúcar produção" },
    "7896110100012": { descricao: "Sal 1",            codigoDestino: "217000", descricaoDestino: "Sal produção" },
    "290815":        { descricao: "Óleo",             codigoDestino: "290815", descricaoDestino: "Óleo produção" },
    "290858":        { descricao: "Leite em pó",      codigoDestino: "290858", descricaoDestino: "Leite em pó prod." },
    "290866":        { descricao: "Leite líquido",    codigoDestino: "290866", descricaoDestino: "Leite líquido prod." },
    "290793":        { descricao: "Creme de leite",   codigoDestino: "290793", descricaoDestino: "Creme de leite prod." },
    "7896215300980": { descricao: "Leite de coco 01", codigoDestino: "264580", descricaoDestino: "Leite de coco prod." },
    "7896215300065": { descricao: "Leite de coco 02", codigoDestino: "264580", descricaoDestino: "Leite de coco prod." },
    "7896012701218": { descricao: "Gelo",             codigoDestino: "292524", descricaoDestino: "Gelo produção" },
    "0751320014788": { descricao: "Ovos galinha",     codigoDestino: "290840", descricaoDestino: "Ovos galinha produção" },
    "965491":        { descricao: "Coco seco",        codigoDestino: "965491", descricaoDestino: "Coco seco produção" },
    "246810":        { descricao: "Prod Novo",        codigoDestino: "123456", descricaoDestino: "Prod. novo produ" },
    "00000":         { descricao: "TESTE",            codigoDestino: "100000", descricaoDestino: "TESTE PRODUÇÃO" }
};

// Variáveis globais
let linhaEditando = null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    popularDatalist();
    configurarEventos();
    carregarDados();
});

function popularDatalist() {
    const datalist = document.getElementById("produtosList");
    datalist.innerHTML = Object.entries(produtos)
        .map(([codigo, produto]) => `<option value="${codigo} - ${produto.descricao}"></option>`)
        .join("");
}

function configurarEventos() {
    // Eventos do formulário principal
    document.querySelector(".btnAdcionar").addEventListener("click", adicionarRegistro);
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);

    // Autocompletar por código
    document.getElementById("codOrigem").addEventListener("input", function() {
        const produto = produtos[this.value.trim()];
        if(produto) preencherCampos(produto, this.value);
    });

    // Autocompletar por seleção
    document.getElementById("descOrigem").addEventListener("change", function() {
        const [codigo] = this.value.split(" - ");
        const produto = produtos[codigo];
        if(produto) {
            this.value = produto.descricao;
            preencherCampos(produto, codigo);
        }
    });

    // Eventos do formulário de edição
    document.getElementById("editCodOrigem").addEventListener("input", function() {
        const produto = produtos[this.value.trim()];
        if(produto) preencherCamposEdicao(produto, this.value);
    });

    document.getElementById("editDescOrigem").addEventListener("change", function() {
        const [codigo] = this.value.split(" - ");
        const produto = produtos[codigo];
        if(produto) {
            this.value = produto.descricao;
            preencherCamposEdicao(produto, codigo);
        }
    });

    // Eventos da tabela
    document.querySelector("#tabela tbody").addEventListener("click", e => {
        if(e.target.classList.contains("editar")) editarRegistro(e.target.closest("tr"));
        if(e.target.classList.contains("remover")) removerRegistro(e.target.closest("tr"));
    });

    // Eventos do modal de edição
    document.querySelector("#formEdicao .salvar").addEventListener("click", salvarEdicao);
    document.querySelector("#formEdicao .cancelar").addEventListener("click", cancelarEdicao);
}

// Funções de autocompletar
function preencherCampos(produto, codigo) {
    document.getElementById("codOrigem").value = codigo;
    document.getElementById("descOrigem").value = produto.descricao;
    document.getElementById("codDestino").value = produto.codigoDestino;
    document.getElementById("descDestino").value = produto.descricaoDestino;
}

function preencherCamposEdicao(produto, codigo) {
    document.getElementById("editCodOrigem").value = codigo;
    document.getElementById("editDescOrigem").value = produto.descricao;
    document.getElementById("editCodDestino").value = produto.codigoDestino;
    document.getElementById("editDescDestino").value = produto.descricaoDestino;
}

// Funções CRUD
function adicionarRegistro() {
    const campos = obterCamposFormulario();
    if(!validarCampos(campos)) return alert("Preencha todos os campos obrigatórios!");

    const novaLinha = criarLinhaTabela(campos);
    document.querySelector("#tabela tbody").appendChild(novaLinha);
    limparFormulario();
    salvarDados();
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

function removerRegistro(linha) {
    linha.remove();
    salvarDados();
}

// Funções auxiliares
function obterCamposFormulario() {
    return {
        setor: document.getElementById("setor").value.trim(),
        funcionario: document.getElementById("funcionario").value.trim(),
        codOrigem: document.getElementById("codOrigem").value.trim(),
        descOrigem: document.getElementById("descOrigem").value.trim(),
        quantOrigem: document.getElementById("quantOrigem").value.trim(),
        codDestino: document.getElementById("codDestino").value.trim(),
        descDestino: document.getElementById("descDestino").value.trim(),
        data: document.getElementById("data").value,
        observacao: document.getElementById("observacao").value.trim()
    };
}

function validarCampos(campos) {
    return campos.setor && campos.funcionario && campos.codOrigem && 
           campos.descOrigem && campos.quantOrigem && campos.data;
}

function criarLinhaTabela(dados) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${dados.setor}</td>
        <td>${dados.funcionario}</td>
        <td>${dados.codOrigem}</td>
        <td>${dados.descOrigem}</td>
        <td>${dados.quantOrigem}</td>
        <td>${dados.codDestino || "--"}</td>
        <td>${dados.descDestino || "--"}</td>
        <td>${dados.data}</td>
        <td>${dados.observacao || "--"}</td>
        <td>
            <button class="editar">Editar</button>
            <button class="remover">Remover</button>
        </td>
    `;
    return tr;
}

// Persistência de dados
function salvarDados() {
    const dados = Array.from(document.querySelectorAll("#tabela tbody tr")).map(linha => {
        const celulas = linha.querySelectorAll("td");
        return {
            setor: celulas[0].textContent,
            funcionario: celulas[1].textContent,
            codOrigem: celulas[2].textContent,
            descOrigem: celulas[3].textContent,
            quantOrigem: celulas[4].textContent,
            codDestino: celulas[5].textContent,
            descDestino: celulas[6].textContent,
            data: celulas[7].textContent,
            observacao: celulas[8].textContent
        };
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    dados.forEach(dado => {
        const novaLinha = criarLinhaTabela(dado);
        document.querySelector("#tabela tbody").appendChild(novaLinha);
    });
}

function limparFormulario() {
    document.querySelectorAll(".formulario input").forEach(input => {
        if(!input.readOnly && input.type !== "button") input.value = "";
    });
}

function cancelarEdicao() {
    document.getElementById("formEdicao").style.display = "none";
    linhaEditando = null;
}

// Exportação de dados
function exportarXLS() {
    const tabela = document.getElementById("tabela");
    const ws = XLSX.utils.table_to_sheet(tabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, "controle_estoque.xlsx");
}

function gerarPDF() {
    const doc = new jspdf.jsPDF({ orientation: "landscape" });
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Solicitação de Remanejamento de Estoque", 15, 15);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 260, 15, { align: "right" });

    // Tabela
    doc.autoTable({
        html: "#tabela",
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [51, 51, 51], textColor: 255 }
    });

    doc.save("solicitacao_remanejamento.pdf");
}
