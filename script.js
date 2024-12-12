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
                    restaurantes {
                        id
                        name
                        user
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
                    }
                }
            `
        }
    };
    ws.send(JSON.stringify(subscriptionQuery));
};

// Função para filtrar restaurantes pelo user (UUID)
function filterByUser() {
    const userInput = document.getElementById('userInput').value; // Campo de entrada do usuário (UUID)

    // Se o valor não estiver vazio, enviar a busca
    if (userInput) {
        ws.send(JSON.stringify({
            type: "start",
            id: "2",
            payload: {
                query: `
                    subscription {
                        restaurantes(where: {user: {_eq: "${userInput}"}}) {
                            id
                            name
                            user
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
                        }
                    }
                `
            }
        }));
    }
}

ws.onmessage = function (event) {
    console.log("Mensagem recebida:", event.data);

    const response = JSON.parse(event.data);

    // Verifica se é a mensagem de dados (subscription)
    if (response.type === "data") {
        const restaurantes = response.payload.data.restaurantes; // Alterado para "restaurantes"
        let restaurantList = "<h2>Restaurantes</h2><ul>";

        restaurantes.forEach(restaurante => {
            let restaurantInfo = `<li>Restaurante ID: ${restaurante.id} - Nome: ${restaurante.name}</li>`;

            if (restaurante.categories && restaurante.categories.length > 0) {
                restaurantInfo += "<ul>";
                restaurante.categories.forEach(category => {
                    restaurantInfo += `<li>Nome da Categoria: ${category.name} - Ordem: ${category.order}</li>`;

                    if (category.products && category.products.length > 0) {
                        restaurantInfo += "<ul>";
                        category.products.forEach(product => {
                            restaurantInfo += `<li>Produto ID: ${product.id} - Nome: ${product.name} - Preço: ${product.price}</li>`;

                            // Corrigido para iterar pelo array de imagens
                            if (product.image && product.image.length > 0) {
                                product.image.forEach(image => {
                                    restaurantInfo += `<li><img src="${image.url}" alt="Imagem do Produto" width="100"/></li>`;
                                });
                            } else {
                                restaurantInfo += "<li>Sem imagens disponíveis para este produto.</li>";
                            }
                        });
                        restaurantInfo += "</ul>";
                    } else {
                        restaurantInfo += "<li>Sem produtos nesta categoria.</li>";
                    }
                });
                restaurantInfo += "</ul>";
            } else {
                restaurantInfo += "<li>Sem categorias neste restaurante.</li>";
            }

            restaurantList += restaurantInfo;
        });

        restaurantList += "</ul>";
        document.getElementById("output").innerHTML = restaurantList;
    }
};


ws.onerror = function (error) {
    console.error("Erro WebSocket:", error);
};

ws.onclose = function () {
    console.log("Conexão WebSocket fechada.");
};
