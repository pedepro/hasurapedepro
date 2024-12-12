// Código específico para a seção Pedidos
console.log('Código da seção Pedidos executado.');


function exibirDadosPedidos() {
    console.log(window.dadosHasura);  // Verifique se os dados estão realmente disponíveis
    if (window.dadosHasura) {
        const userListElement = document.getElementById("output");
        let userListContent = "<h3>Usuários e Restaurantes</h3><ul>";

        window.dadosHasura.forEach(user => {
            let userInfo = `<li>ID: ${user.id} - Nome: ${user.name} - Email: ${user.email}</li>`;

            if (user.restaurantes && user.restaurantes.length > 0) {
                userInfo += "<ul>";
                user.restaurantes.forEach(restaurant => {
                    userInfo += `<li>ID Restaurante: ${restaurant.id} - Nome: ${restaurant.name}</li>`;

                    if (restaurant.categories && restaurant.categories.length > 0) {
                        userInfo += "<ul>";
                        restaurant.categories.forEach(category => {
                            userInfo += `<li>Categoria: ${category.name} - Ordem: ${category.order}</li>`;

                            if (category.products && category.products.length > 0) {
                                userInfo += "<ul>";
                                category.products.forEach(product => {
                                    userInfo += `<li>Produto: ${product.name} - Preço: ${product.price}</li>`;

                                    // Exibe as imagens dos produtos, se existirem
                                    if (product.image && product.image.length > 0) {
                                        product.image.forEach(image => {
                                            userInfo += `<li><img src="${image.url}" alt="${image.description}" width="100"/> - Descrição: ${image.description}</li>`;
                                        });
                                    }
                                });
                                userInfo += "</ul>";
                            } else {
                                userInfo += "<li>Sem produtos nesta categoria.</li>";
                            }
                        });
                        userInfo += "</ul>";
                    } else {
                        userInfo += "<li>Sem categorias para este restaurante.</li>";
                    }
                });
                userInfo += "</ul>";
            } else {
                userInfo += "<li>Sem restaurantes para este usuário.</li>";
            }

            userListContent += userInfo;
        });

        userListContent += "</ul>";
        userListElement.innerHTML = userListContent;  // Atualiza o conteúdo do #userList
    } else {
        console.log("Ainda não há dados disponíveis.");
    }
}



