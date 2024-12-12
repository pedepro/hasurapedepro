// Verifica se os dados estão disponíveis
if (window.dadosHasura) {
    // Renderiza os dados na div do pedidos-content
    const pedidosContent = document.getElementById('pedidos-content');

    let userList = "<h2>Usuários, Restaurantes e Pedidos</h2><ul>";

    window.dadosHasura.forEach(user => {
        userList += `<li><strong>Usuário:</strong> ${user.name} | <strong>Email:</strong> ${user.email}</li>`;

        // Verifica se o usuário possui restaurantes
        if (user.restaurantes && user.restaurantes.length > 0) {
            userList += "<ul>";
            user.restaurantes.forEach(restaurant => {
                userList += `
                    <li>
                        <strong>Restaurante:</strong> ${restaurant.name}
                    </li>
                `;

                // Verifica se o restaurante possui pedidos
                if (restaurant.orders && restaurant.orders.length > 0) {
                    userList += "<ul>";
                    restaurant.orders.forEach(order => {
                        userList += `
                            <li>
                                <strong>Pedido ID:</strong> ${order.id} | 
                                <strong>Cliente:</strong> ${order.customer_name} | 
                                <strong>Telefone:</strong> ${order.customer_phone} | 
                                <strong>Tipo:</strong> ${order.type} | 
                                <strong>Valor Total:</strong> R$ ${order.total_value}
                            </li>
                        `;
                    });
                    userList += "</ul>";
                } else {
                    userList += "<li><em>Sem pedidos cadastrados.</em></li>";
                }
            });
            userList += "</ul>";
        } else {
            userList += "<li><em>Sem restaurantes cadastrados.</em></li>";
        }
    });

    userList += "</ul>";
    pedidosContent.innerHTML = userList;
} else {
    console.error("Dados não encontrados no window.dadosHasura.");
}


if (window.dadosHasura) {
    // Cria a lista de pedidos a partir dos dados do Hasura, filtrando apenas os status relevantes
    const pedidos = [];

    window.dadosHasura.forEach(user => {
        if (user.restaurantes && user.restaurantes.length > 0) {
            user.restaurantes.forEach(restaurant => {
                if (restaurant.orders && restaurant.orders.length > 0) {
                    restaurant.orders.forEach(order => {
                        if (["PENDENTE", "ACEITO", "A CAMINHO", "PRONTO PARA RETIRADA"].includes(order.status)) {
                            pedidos.push({
                                id: order.id,
                                cliente: order.customer_name || "Cliente não identificado",
                                whatsapp: order.customer_phone || "Telefone não disponível",
                                entrega: order.type || "Tipo não especificado",
                                pagamento: "Método não especificado", // Atualize conforme necessário
                                status: order.status
                            });
                        }
                    });
                }
            });
        }
    });

    // Renderiza os pedidos
    function renderizarPedidos() {
        const containers = {
            pendentes: document.querySelector("#pendentes .pedido-lista"),
            aceitos: document.querySelector("#aceitos .pedido-lista"),
            "a-caminho-pronto": document.querySelector("#a-caminho-pronto .pedido-lista")
        };

        // Limpa os contêineres
        Object.values(containers).forEach(container => container.innerHTML = "");

        // Renderiza os pedidos filtrados
        pedidos.forEach(pedido => {
            let containerKey;
            if (pedido.status === "PENDENTE") {
                containerKey = "pendentes";
            } else if (pedido.status === "ACEITO") {
                containerKey = "aceitos";
            } else if (pedido.status === "A CAMINHO" || pedido.status === "PRONTO PARA RETIRADA") {
                containerKey = "a-caminho-pronto";
            }

            if (containerKey) {
                const card = document.createElement("div");
                card.classList.add("pedido-card");

                const buttonText = {
                    PENDENTE: "Aceitar Pedido",
                    ACEITO: "Avançar",
                    "A CAMINHO": "Finalizar Pedido",
                    "PRONTO PARA RETIRADA": "Finalizar Pedido"
                };

                card.innerHTML = `
                    <h4>Pedido #${pedido.id} - ${pedido.cliente}</h4>
                    <p class="pedido-info">
                        WhatsApp: ${pedido.whatsapp}<br>
                        Entrega: ${pedido.entrega}<br>
                        Pagamento: ${pedido.pagamento}
                    </p>
                    <div class="pedido-acoes">
                        <button onclick="alterarStatus(${pedido.id})">${buttonText[pedido.status]}</button>
                        <div class="icons">
                            <i class="fas fa-print" title="Imprimir"></i>
                            <i class="fas fa-ellipsis-v" title="Menu"></i>
                        </div>
                    </div>
                `;

                containers[containerKey].appendChild(card);
            }
        });
    }

    // Função para alterar o status do pedido
    function alterarStatus(id) {
        const pedido = pedidos.find(p => p.id === id);

        if (pedido) {
            if (pedido.status === "PENDENTE") pedido.status = "ACEITO";
            else if (pedido.status === "ACEITO") pedido.status = "A CAMINHO";
            else if (pedido.status === "A CAMINHO" || pedido.status === "PRONTO PARA RETIRADA") pedido.status = "FINALIZADO";

            renderizarPedidos();
        }
    }

    // Renderiza os pedidos inicialmente
    renderizarPedidos();
} else {
    console.error("Dados não encontrados no window.dadosHasura.");
}

