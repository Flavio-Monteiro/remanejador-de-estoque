let registros = []; // Lista para armazenar os registros

// Função para adicionar registro à tabela
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

    // Adiciona o registro no array 'registros'
    registros.push({
        nome,
        setor,
        codOrigem,
        descOrigem,
        quantOrigem,
        codDestino,
        descDestino,
        quantDestino,
        data
    });

    // Atualiza a tabela na tela com o novo registro
    let tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    let novaLinha = tabela.insertRow();
    novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${setor}</td>
        <td>${codOrigem}</td>
        <td>${descOrigem}</td>
        <td>${quantOrigem}</td>
        <td>${codDestino}</td>
        <td>${descDestino}</td>
        <td>${quantDestino}</td>
        <td>${data}</td>
        <td><button onclick="removerLinha(this)">Remover</button></td>
    `;
}

// Função para remover linha da tabela
function removerLinha(botao) {
    let linha = botao.parentNode.parentNode;
    linha.parentNode.removeChild(linha);
}

// Função para gerar o PDF
function gerarPDF() {
    // Cria um novo elemento de tabela para o PDF
    const tabela = document.createElement('table');
    const thead = tabela.createTHead();
    const headerRow = thead.insertRow();
    headerRow.innerHTML = `
        <th>Nome</th>
        <th>Setor</th>
        <th>Cód. Origem</th>
        <th>Produto Origem</th>
        <th>Quant</th>
        <th>Cód. Destino</th>
        <th>Produto Destino</th>
        <th>Quant</th>
        <th>Data</th>
    `;
    
    const tbody = tabela.createTBody();
    
    // Preenche a tabela com os registros armazenados no array 'registros'
    registros.forEach(registro => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${registro.nome}</td>
            <td>${registro.setor}</td>
            <td>${registro.codOrigem}</td>
            <td>${registro.descOrigem}</td>
            <td>${registro.quantOrigem}</td>
            <td>${registro.codDestino}</td>
            <td>${registro.descDestino}</td>
            <td>${registro.quantDestino}</td>
            <td>${registro.data}</td>
        `;
    });

    // Cria um container para incluir o título do relatório
    const container = document.createElement("div");
    const titulo = document.createElement("h2");
    titulo.textContent = "SOLICITAÇÃO DE REMANEJAMENTO DE ESTOQUE DE PÃES";
    titulo.style.textAlign = "center";
    titulo.style.marginBottom = "20px";
    container.appendChild(titulo);
    container.appendChild(tabela);

    // Opções de configuração do PDF
    const opt = {
        margin: 10,
        filename: "Controle_de_Retirada.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    };

    // Gera o PDF codigo correto
    html2pdf().set(opt).from(container).save();
}
