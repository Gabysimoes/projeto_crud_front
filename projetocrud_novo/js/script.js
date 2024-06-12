

// Simula um banco de dados em memória
var clientes = [];

// Guarda o objeto que está sendo alterado
var clienteAlterado = null;

function adicionar() {
    document.getElementById("cpf").disabled = false;
    clienteAlterado = null;
    mostrarModal();
    limparForm();
}

function alterar(cpf) {
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        if (cliente.cpf == cpf) {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("apelido").value = cliente.apelido;
            document.getElementById("time").value = cliente.time;
            clienteAlterado = cliente;
        }
    }
    document.getElementById("cpf").disabled = true;
    mostrarModal();
}

function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE"
        }).then((response) => {
            recarregarClientes();
            alert("Cliente excluído com sucesso");
        }).catch((error) => {
            console.log(error);
            alert("Não foi possível excluir o cliente");
        });
    }
}

function mostrarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "flex";
}

function ocultarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "none";
}

function cancelar() {
    ocultarModal();
    limparForm();
}

function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let apelido = document.getElementById("apelido").value;
    let time = document.getElementById("time").value;

    if (clienteAlterado == null) {
        let cliente = { "nome": nome, "cpf": cpf, "telefone": telefone,"apelido": apelido,"time": time  }; //aqui para funcionar 
        fetch("http://localhost:3000/cadastrar", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null;
            limparForm();
            ocultarModal();
            recarregarClientes();
            alert("Cliente cadastrado com sucesso");
        }).catch(() => {
            alert("Ops... algo deu errado ao cadastrar o cliente");
        });
    } else {
        clienteAlterado.nome = nome;
        clienteAlterado.cpf = cpf;
        clienteAlterado.telefone = telefone;
        //aqui tbm
        clienteAlterado.apelido = apelido;
        clienteAlterado.time = time;
        fetch("http://localhost:3000/alterar", {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        }).then((response) => {
            clienteAlterado = null;
            limparForm();
            ocultarModal();
            recarregarClientes();
            alert("Cliente alterado com sucesso");
        }).catch(() => {
            alert("Ops... algo deu errado ao alterar o cliente");
        });
    }
}



function ordenarClientesPorNome() {
    clientes.sort((a, b) => a.nome.localeCompare(b.nome));
} 


function exibirDados() {

    ordenarClientesPorNome()

    
    let tbody = document.querySelector("#table-customers tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < clientes.length; i++) {
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>
            <td>${clientes[i].apelido}</td> 
            <td>${clientes[i].time}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`;

        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    }
}

function limparForm() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("apelido").value = "";
    document.getElementById("time").value = "";
    document.getElementById("buscar").value = "";
}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: { "Content-Type": "application/json" },
        method: "GET"
    }).then((response) => response.json())
        .then((response) => {
            clientes = response;
            exibirDados();
        }).catch((error) => {
            alert("Erro ao listar os clientes");
        });
}


function PesquisarClientes() {
    let PesquisarCliente = document.getElementById("buscar").value.trim();
    if (PesquisarCliente != "") {
        fetch("http://localhost:3000/pesquisar?PesquisarCliente=" + PesquisarCliente, {
            headers: { 
                "Content-Type": "application/json" 
            },
            method: "GET"
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao buscar o CPF do cliente');
            }
        }).then((response) => {
            if (response.length > 0) {
                clientes = response;
                exibirDados(clientes);
            } else {
                alert("Não foi encontrado nenhum usuário com esse CPF.");
            }
        }).catch((error) => {
            alert(error.message);
        });
    } else {
        alert("Digite o CPF do usuário para a sua busca.");
    }
}
