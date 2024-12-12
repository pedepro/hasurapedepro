const websocketUrl = "wss://backend.pedepro.com.br/v1/graphql";

const ws = new WebSocket(websocketUrl, 'graphql-ws'); // Usando 'graphql-ws' como protocolo

ws.onopen = function () {
    console.log("Conexão WebSocket aberta!");

    const connectionInitMsg = {
        type: 'connection_init',
        payload: {
            headers: {
                "x-hasura-admin-secret": "dz9uee0D8fyyYzQsv2piE1MLcVZklkc7"
            }
        }
    };
    ws.send(JSON.stringify(connectionInitMsg));

    const subscriptionQuery = {
        type: "start",
        id: "1",
        payload: {
            query: `
                subscription {
                    user {
                        id
                        name
                        email
                        restaurantes {
                            id
                            name
                            categories {
                                name
                                order
                                products {
                                    id
                                    name
                                    price
                                    image {
                                        id
                                        url
                                    }
                                }
                            }
                            orders {
                                id
                                customer
                                total_value
                                restaurant
                                customer_name
                                customer_phone
                                type
                                status
                            }
                        }
                    }
                }
            `
        }
    };
    ws.send(JSON.stringify(subscriptionQuery));
};

ws.onmessage = function (event) {
    console.log("Mensagem recebida:", event.data);

    const response = JSON.parse(event.data);

    if (response.type === "data") {
        const users = response.payload.data.user;

        // Salva os dados no window.dadosHasura
        window.dadosHasura = users;
        console.log("Dados salvos no window.dadosHasura:", users);

        // Verifica o parâmetro de sessão na URL
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session');

        if (session === 'gestor-de-pedidos') {
            // Carrega os arquivos dinamicamente
            loadDashboardAssets();
        }
        if (session === 'ver-lista-de-clientes') {
            // Carrega os arquivos dinamicamente
            loadDashboardAssets();
        }
    }
};

ws.onerror = function (error) {
    console.error("Erro WebSocket:", error);
};

ws.onclose = function () {
    console.log("Conexão WebSocket fechada.");
};

function loadDashboardAssets() {
    // Carrega o CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'pedidos/pedidos.css';
    document.head.appendChild(link);

    // Carrega o HTML
    fetch('pedidos/pedidos.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('dashboard-container').innerHTML = html;

            // Carrega o JS
            const script = document.createElement('script');
            script.src = 'pedidos/pedidos.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error("Erro ao carregar o HTML pedidos:", error));
}