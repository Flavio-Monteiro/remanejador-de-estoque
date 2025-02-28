function salvarDados() {
        // Cria um array vazio para armazenar os dados da tabela
    const dados = [];
    
        // Seleciona todas as linhas da tabela (cada linha é um registro)
    document.querySelectorAll("#tabela tbody tr").forEach(linha => {
        // Seleciona todas as células (td) da linha atual
        const celulas = linha.querySelectorAll("td");

        // Adiciona um objeto com os dados da linha ao array "dados"
        dados.push({
            setor: celulas[0].textContent, // Setor
            funcionario: celulas[1].textContent, // Nome do Funcionário
            codOrigem: celulas[2].textContent, // Código de Origem
            descOrigem: celulas[3].textContent, // Descrição do Produto Retirado
            quantOrigem: celulas[4].textContent, // Quantidade Retirada
            codDestino: celulas[5].textContent, // Código de Destino
            descDestino: celulas[6].textContent, // Descrição do Produto de Produção
            quantDestino: celulas[7].textContent // Quantidade para Produção
        });
    });
     // Salva o array "dados" no localStorage, convertendo-o para JSON
     localStorage.setItem("dadosTabela", JSON.stringify(dados));
}

function carregarDados() {
    // Recupera os dados salvos no localStorage e converte de JSON para um array
    const dados = JSON.parse(localStorage.getItem("dadosTabela")) || [];

    // Seleciona o corpo da tabela (tbody)
    const tbody = document.querySelector("#tabela tbody");

    // Para cada registro no array "dados", cria uma nova linha na tabela
    dados.forEach(row => {
        const novaLinha = criarLinhaTabela(
            row.setor, row.funcionario, row.codOrigem, row.descOrigem,
            row.quantOrigem, row.codDestino, row.descDestino, row.quantDestino
        );
        tbody.appendChild(novaLinha); // Adiciona a nova linha à tabela
    });
}

function criarLinhaTabela(setor, funcionario, codOrigem, descOrigem, quantOrigem, codDestino, descDestino, quantDestino) {
    // Cria uma nova linha (tr) para a tabela
    const novaLinha = document.createElement("tr");

    // Define os valores das células da linha
    const celulas = [
        setor, funcionario, codOrigem, descOrigem, quantOrigem,
        codDestino || "N/A", // Se não houver código de destino, usa "N/A"
        descDestino || "N/A", // Se não houver descrição de destino, usa "N/A"
        quantDestino || "N/A" // Se não houver quantidade de destino, usa "N/A"
    ];

    // Para cada valor, cria uma célula (td) e adiciona à linha
    celulas.forEach(texto => {
        const celula = document.createElement("td");
        celula.textContent = texto; // Define o conteúdo da célula
        novaLinha.appendChild(celula); // Adiciona a célula à linha
    });

    // Cria um botão "Remover" para a linha
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover"; // Define o texto do botão
    btnRemover.onclick = function () {
        // Remove a linha ao clicar no botão
        this.closest("tr").remove();
        // Atualiza os dados no localStorage após a remoção
        salvarDados();
    };

    // Cria uma célula para o botão "Remover"
    const celulaAcao = document.createElement("td");
    celulaAcao.appendChild(btnRemover); // Adiciona o botão à célula
    novaLinha.appendChild(celulaAcao); // Adiciona a célula à linha

    // Retorna a linha completa
    return novaLinha;
}

function importarXLS() {
    // Obtém o arquivo selecionado pelo usuário
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
        alert("Selecione um arquivo XLS/XLSX!"); // Alerta se nenhum arquivo for selecionado
        return;
    }

    // Cria um leitor de arquivos
    const reader = new FileReader();
    reader.onload = function (e) {
        // Converte o arquivo para um array de bytes
        const data = new Uint8Array(e.target.result);
        // Lê o arquivo XLS/XLSX
        const workbook = XLSX.read(data, { type: 'array' });
        // Obtém a primeira planilha do arquivo
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Converte a planilha para um array de objetos JSON
        const json = XLSX.utils.sheet_to_json(sheet);

        // Seleciona o corpo da tabela
        const tbody = document.querySelector("#tabela tbody");
        // Para cada objeto no array JSON, cria uma nova linha na tabela
        json.forEach(row => {
            const novaLinha = criarLinhaTabela(
                row.Setor, row.Funcionário, row["Código de Origem"],
                row["Descrição de Origem"], row["Quantidade de Origem"],
                row["Código de Destino"], row["Descrição de Destino"], row["Quantidade de Destino"]
            );
            tbody.appendChild(novaLinha); // Adiciona a linha à tabela
        });
        salvarDados(); // Atualiza os dados no localStorage
    };
    // Lê o arquivo como um array de bytes
    reader.readAsArrayBuffer(file);
}

function exportarXLS() {
    // Seleciona a tabela
    const tabela = document.getElementById("tabela");
    // Converte a tabela para uma planilha
    const ws = XLSX.utils.table_to_sheet(tabela);
    // Cria um novo livro de trabalho
    const wb = XLSX.utils.book_new();
    // Adiciona a planilha ao livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    // Exporta o arquivo XLSX
    XLSX.writeFile(wb, "controle_estoque.xlsx");
}

function gerarPDF() {
    // Clona a tabela para evitar modificar a original
    const tabela = document.getElementById("tabela").cloneNode(true);
    // Remove a coluna de ações (botão "Remover") de cada linha
    tabela.querySelectorAll("tr").forEach(linha => linha.removeChild(linha.lastElementChild));
    // Gera o PDF a partir da tabela
    html2pdf().from(tabela).set({ margin: 10, filename: "controle_estoque.pdf", jsPDF: { orientation: "landscape" } }).save();
}
window.onload = carregarDados;