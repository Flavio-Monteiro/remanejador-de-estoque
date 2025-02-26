function adicionarRegistro() {
    const setor = document.getElementById("setor").value;
    const funcionario = document.getElementById("funcionario").value;
    const codOrigem = document.getElementById("codOrigem").value;
    const descOrigem = document.getElementById("descOrigem").value;
    const quantOrigem = document.getElementById("quantOrigem").value;
    const codDestino = document.getElementById("codDestino").value;
    const descDestino = document.getElementById("descDestino").value;
    const quantDestino = document.getElementById("quantDestino").value;

    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !codDestino || !descDestino || !quantDestino) {
        alert("Preencha todos os campos!");
        return;
    }

    const tabela = document.getElementById("tabela").getElementsByTagName("tbody")[0];
    const novaLinha = tabela.insertRow();

    novaLinha.insertCell(0).textContent = setor;
    novaLinha.insertCell(1).textContent = funcionario;
    novaLinha.insertCell(2).textContent = codOrigem;
    novaLinha.insertCell(3).textContent = descOrigem;
    novaLinha.insertCell(4).textContent = quantOrigem;
    novaLinha.insertCell(5).textContent = codDestino;
    novaLinha.insertCell(6).textContent = descDestino;
    novaLinha.insertCell(7).textContent = quantDestino;

    // Adicionar botão de remover
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.onclick = function () {
        this.parentElement.parentElement.remove();
    };
    novaLinha.insertCell(8).appendChild(btnRemover);

    // Limpar os campos
    document.querySelectorAll(".formulario input").forEach(input => input.value = "");
}

function gerarPDF() {
    const tabela = document.getElementById("tabela").cloneNode(true);

    // Remover coluna de botões
    for (let i = 0; i < tabela.rows.length; i++) {
        tabela.rows[i].deleteCell(-1);
    }

    // Criar container para o PDF
    const container = document.createElement("div");
    const titulo = document.createElement("h2");
    titulo.textContent = "SOLICITAÇÃO DE REMANEJAMENTO DE ESTOQUE DE PÃES";
    titulo.style.textAlign = "center";

    container.appendChild(titulo);
    container.appendChild(tabela);

    // Gerar PDF
    html2pdf().set({
        margin: 5,
        filename: "Solicitação_Retirada.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    }).from(container).save();
}
// OK