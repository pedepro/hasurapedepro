const websocketUrl = "wss://backend.pedepro.com.br/v1/graphql";

const ws = new WebSocket(websocketUrl, 'graphql-ws');  // Usando 'graphql-ws' como protocolo

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
                        restaurantes(limit: 1) {
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
                                total_value
                            }
                        }
                    }
                }
            `
        }
    };
    ws.send(JSON.stringify(subscriptionQuery));
};

// Função para filtrar os usuários com base no token inserido
function filterByToken() {
    const tokenInput = document.getElementById('tokenInput').value;

    // Se o token não estiver vazio, enviar a busca de token
    if (tokenInput) {
        ws.send(JSON.stringify({
            type: "start",
            id: "2",
            payload: {
                query: `
                    subscription {
                        user(where: {token: {_eq: "${tokenInput}"}}) {
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
        const users = response.payload.data.user;
        let userList = "<h2>Users and Restaurants</h2><ul>";

        users.forEach(user => {
            let userInfo = `<li>ID: ${user.id} - Name: ${user.name} - Email: ${user.email}</li>`;

            if (user.restaurantes && user.restaurantes.length > 0) {
                userInfo += "<ul>";
                user.restaurantes.forEach(restaurant => {
                    userInfo += `<li>Restaurant ID: ${restaurant.id} - Name: ${restaurant.name}</li>`;

                    if (restaurant.categories && restaurant.categories.length > 0) {
                        userInfo += "<ul>";
                        restaurant.categories.forEach(category => {
                            userInfo += `<li>Category Name: ${category.name} - Order: ${category.order}</li>`;

                            if (category.products && category.products.length > 0) {
                                userInfo += "<ul>";
                                category.products.forEach(product => {
                                    userInfo += `<li>Product ID: ${product.id} - Name: ${product.name} - Price: ${product.price}</li>`;

                                    // Verifica se existem imagens e exibe
                                    if (product.image && product.image.length > 0) {
                                        userInfo += "<ul>";
                                        product.image.forEach(image => {
                                            userInfo += `<li><img src="${image.url}" alt="${image.description}" width="100"/> - Description: ${image.description}</li>`;
                                        });
                                        userInfo += "</ul>";
                                    } else {
                                        userInfo += "<li>No image found for this product.</li>";
                                    }
                                });
                                userInfo += "</ul>";
                            } else {
                                userInfo += "<li>No products found for this category.</li>";
                            }
                        });
                        userInfo += "</ul>";
                    } else {
                        userInfo += "<li>No categories found for this restaurant.</li>";
                    }

                    // Exibe pedidos (orders)
                    if (restaurant.orders && restaurant.orders.length > 0) {
                        userInfo += "<ul>";
                        restaurant.orders.forEach(order => {
                            userInfo += `<li>Order ID: ${order.id} - Status: ${order.status} - Total: $${order.total} - Date: ${new Date(order.created_at).toLocaleString()}</li>`;
                        });
                        userInfo += "</ul>";
                    } else {
                        userInfo += "<li>No orders found for this restaurant.</li>";
                    }
                });
                userInfo += "</ul>";
            } else {
                userInfo += "<li>No restaurants found for this user.</li>";
            }

            userList += userInfo;
        });

        userList += "</ul>";
        document.getElementById("output").innerHTML = userList;
    }
};


ws.onerror = function (error) {
    console.error("Erro WebSocket:", error);
};

ws.onclose = function () {
    console.log("Conexão WebSocket fechada.");
};
