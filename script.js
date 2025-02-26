// Função para salvar os dados da tabela no localStorage
function salvarDados() {
    const tabela = document.getElementById("tabela").innerHTML;
    localStorage.setItem("dadosTabela", tabela);
}

// Função para carregar os dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem("dadosTabela");
    if (dados) {
        document.getElementById("tabela").innerHTML = dados;

        // Reaplicar o evento de remoção aos botões "Remover"
        document.querySelectorAll("td button").forEach(button => {
            button.onclick = function () {
                this.parentElement.parentElement.remove();
                salvarDados(); // Salvar os dados após remover um registro
            };
        });
    }
}

// Carregar os dados ao abrir a página
window.onload = carregarDados;

// Função para adicionar um registro
function adicionarRegistro() {
    const setor = document.getElementById("setor").value;
    const funcionario = document.getElementById("funcionario").value;
    const codOrigem = document.getElementById("codOrigem").value;
    const descOrigem = document.getElementById("descOrigem").value;
    const quantOrigem = document.getElementById("quantOrigem").value;
    const codDestino = document.getElementById("codDestino").value;
    const descDestino = document.getElementById("descDestino").value;
    const quantDestino = document.getElementById("quantDestino").value;

    // Verificar se todos os campos foram preenchidos
    if (!setor || !funcionario || !codOrigem || !descOrigem || !quantOrigem || !codDestino || !descDestino || !quantDestino) {
        alert("Preencha todos os campos!");
        return;
    }

    // Inserir uma nova linha na tabela
    const tabela = document.getElementById("tabela").getElementsByTagName("tbody")[0];
    const novaLinha = tabela.insertRow();

    // Preencher as células da nova linha
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
        salvarDados(); // Salvar os dados após remover um registro
    };
    novaLinha.insertCell(8).appendChild(btnRemover);

    // Limpar os campos do formulário
    document.querySelectorAll(".formulario input").forEach(input => input.value = "");

    // Salvar os dados após adicionar um registro
    salvarDados();
}

// Função para gerar PDF
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

    // Adicionar a data atual
    const dataAtual = document.createElement("p");
    dataAtual.textContent = "Data: " + new Date().toLocaleDateString();
    dataAtual.style.textAlign = "center";

    container.appendChild(titulo);
    container.appendChild(dataAtual); // Adicionar a data ao container
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