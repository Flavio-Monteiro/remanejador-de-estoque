function adicionarRegistro() {
    let nome = document.getElementById('nome').value;
    let setor = document.getElementById('setor').value;
    let codOrigem = document.getElementById('codOrigem').value;
    let descOrigem = document.getElementById('descOrigem').value;
    let quantOrigem = document.getElementById('quantOrigem').value;
    let codDestino = document.getElementById('codDestino').value;
    let descDestino = document.getElementById('descDestino').value;
    let quantDestino = document.getElementById('quantDestino').value;
    let data = new Date().toLocaleString();

    let tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    let novaLinha = tabela.insertRow();
    novaLinha.innerHTML = `<td>${nome}</td><td>${setor}</td><td>${codOrigem}</td><td>${descOrigem}</td>
                           <td>${quantOrigem}</td><td>${codDestino}</td><td>${descDestino}</td>
                           <td>${quantDestino}</td><td>${data}</td>
                           <td><button onclick="removerLinha(this)">Remover</button></td>`;
}

function removerLinha(botao) {
    let linha = botao.parentNode.parentNode;
    linha.parentNode.removeChild(linha);
}

function gerarPDF() {
    const tabela = document.getElementById("tabela");
    const novaTabela = tabela.cloneNode(true);
    
    // Remove a última coluna (Ação) para não aparecer no PDF
    for (let i = 0; i < novaTabela.rows.length; i++) {
        novaTabela.rows[i].deleteCell(-1);
    }
    
    // Criar um novo elemento para incluir o título
    const container = document.createElement("div");
    const titulo = document.createElement("h2");
    titulo.textContent = "SOLICITAÇÃO DE REMANEJAMENTO DE ESTOQUE DE PÃES";
    titulo.style.textAlign = "center";
    titulo.style.marginBottom = "20px";
    container.appendChild(titulo);
    container.appendChild(novaTabela);

    const opt = {
        margin: 10,
        filename: "Controle_de_Retirada.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    };
    
    html2pdf().set(opt).from(container).save();
}


