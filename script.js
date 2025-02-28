document.addEventListener("DOMContentLoaded", function () {
    carregarDados();

    // Adicionar evento de clique ao botão "Adicionar"
    document.getElementById("btnAdicionar").addEventListener("click", adicionarRegistro);

    // Adicionar evento de clique ao botão "Exportar PDF"
    document.getElementById("exportarPDF").addEventListener("click", gerarPDF);

    // Adicionar evento de clique ao botão "Exportar XLS"
    document.getElementById("exportarXLS").addEventListener("click", exportarXLS);
});

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
        return;
    }

    // Cria uma nova linha na tabela
    const novaLinha = criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino);

    // Adiciona a linha ao corpo da tabela
    document.querySelector("#tabela tbody").appendChild(novaLinha);

    // Salva os dados no localStorage
    salvarDados();

    // Limpa os campos do formulário após a adição
    document.getElementById("setor").value = "";
    document.getElementById("funcionario").value = "";
    document.getElementById("codOrigem").value = "";
    document.getElementById("descOrigem").value = "";
    document.getElementById("quantOrigem").value = "";
    document.getElementById("codDestino").value = "";
    document.getElementById("descDestino").value = "";
    document.getElementById("quantDestino").value = "";
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
            quantDestino: celulas[7].textContent
        });
    });
    localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];
    const tbody = document.querySelector("#tabela tbody");
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(row.setor, row.funcionario, row.codOrigem, row.descOrigem, row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino);
        tbody.appendChild(novaLinha);
    });
}

function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino) {
    const novaLinha = document.createElement("tr");
    const celulas = [setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino || "---", descDestino || "--", quantDestino || "---"];

    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto;
        novaLinha.appendChild(celula);
    });

    // Criando botão para remover a linha
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
    const tabela = document.getElementById("tabela").cloneNode(true);
    tabela.querySelectorAll("tr").forEach(linha => linha.removeChild(linha.lastElementChild));
    html2pdf().from(tabela).set({ margin: 10, filename: "controle_estoque.pdf", jsPDF: { orientation: "landscape" } }).save();
}