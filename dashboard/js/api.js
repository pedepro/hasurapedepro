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
                        }
                    }
                }
            `
        }
    };
    ws.send(JSON.stringify(subscriptionQuery));
}

ws.onmessage = function (event) {
    console.log("Mensagem recebida:", event.data);

    const response = JSON.parse(event.data);

    // Verifica se é a mensagem de dados (subscription)
    if (response.type === "data") {
        const users = response.payload.data.user;

        // Salva os dados no window.dadosHasura
        window.dadosHasura = users;

        // Log para verificar se os dados estão sendo salvos corretamente
        console.log('Dados salvos em window.dadosHasura', window.dadosHasura);

        // Renderiza os dados (exemplo)
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

                                    // Verifica se existem imagem e exibe
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
                });
                userInfo += "</ul>";
            } else {
                userInfo += "<li>No restaurants found for this user.</li>";
            }

            userList += userInfo;
        });

        userList += "</ul>";
        document.getElementById("output2").innerHTML = userList;
    }
};

ws.onerror = function (error) {
    console.error("Erro WebSocket:", error);
};

ws.onclose = function () {
    console.log("Conexão WebSocket fechada.");
};
