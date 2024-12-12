// Função para alternar a visibilidade do menu lateral
function toggleSlider() {
    const slider = document.getElementById("floatingColumn");

    // Verifica se o menu está visível ou não e altera a posição
    if (slider.style.left === "0px") {
        // Esconde o menu, movendo para a esquerda
        slider.style.left = "-270px";
    } else {
        // Exibe o menu, movendo para a posição inicial à direita
        slider.style.left = "0px";
    }
}

function carregarBotoesMenu() {
    fetch('components/sidebar/menuButtons.json') // Caminho ajustado para o arquivo JSON
        .then(response => response.json()) // Lê o arquivo JSON
        .then(data => {
            const menu = document.querySelector('.floating-column'); // Seleciona o menu flutuante
            menu.innerHTML = ''; // Limpa o conteúdo do menu antes de adicionar os novos botões

            // Adiciona o campo de pesquisa
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'searchInput';
            searchInput.classList.add('search-input');
            searchInput.placeholder = 'Pesquise...';
            menu.appendChild(searchInput);

            // Filtragem com base na pesquisa
            searchInput.addEventListener('input', () => {
                const searchValue = searchInput.value.toLowerCase();
                const allButtons = menu.querySelectorAll('.menu-button, .section-header');
                allButtons.forEach(button => {
                    const textContent = button.textContent.toLowerCase();
                    button.style.display = textContent.includes(searchValue) ? 'block' : 'none';
                });
            });

            // Adiciona seções e botões com base nos dados
            data.forEach(section => {
                // Cria o cabeçalho da seção
                const sectionHeader = document.createElement('div');
                sectionHeader.classList.add('section-header');
                sectionHeader.textContent = section.label; // Nome da seção
                menu.appendChild(sectionHeader);

                // Adiciona os botões da seção
                section.buttons.forEach(buttonData => {
                    const button = document.createElement('a');
                    button.id = buttonData.id;
                    
                    // Adiciona o parâmetro "session" na URL sem sobrescrever o caminho
                    const currentUrl = new URL(window.location.href);  // Pega a URL atual
                    currentUrl.searchParams.set('session', buttonData.id);  // Adiciona/atualiza o parâmetro "session"
                    button.href = currentUrl.toString();  // Define o link com o parâmetro

                    button.classList.add('menu-button');

                    // Adiciona o ícone (se existir)
                    if (buttonData.icon) {
                        const icon = document.createElement('i');
                        icon.className = buttonData.icon;
                        button.appendChild(icon);
                    }

                    // Adiciona o texto do botão
                    const label = document.createElement('span');
                    label.textContent = buttonData.label;
                    button.appendChild(label);

                    menu.appendChild(button);

                    // Submenus (se existirem)
                    if (buttonData.submenu) {
                        const submenuContainer = document.createElement('div');
                        submenuContainer.classList.add('submenu-container');

                        buttonData.submenu.forEach(submenuItem => {
                            const submenuButton = document.createElement('a');
                            submenuButton.id = submenuItem.id;

                            // Adiciona o parâmetro "session" na URL sem sobrescrever o caminho
                            const submenuUrl = new URL(window.location.href);  // Pega a URL atual
                            submenuUrl.searchParams.set('session', submenuItem.id);  // Adiciona/atualiza o parâmetro "session"
                            submenuButton.href = submenuUrl.toString();  // Define o link com o parâmetro

                            submenuButton.classList.add('submenu-button');

                            if (submenuItem.icon) {
                                const subIcon = document.createElement('i');
                                subIcon.className = submenuItem.icon;
                                submenuButton.appendChild(subIcon);
                            }

                            const subLabel = document.createElement('span');
                            subLabel.textContent = submenuItem.label;
                            submenuButton.appendChild(subLabel);

                            submenuContainer.appendChild(submenuButton);
                        });

                        menu.appendChild(submenuContainer);

                        button.addEventListener('click', event => {
                            event.preventDefault();
                            submenuContainer.classList.toggle('active');
                        });
                    }
                });
            });
        })
        .catch(error => console.error("Erro ao carregar os dados dos botões:", error));
}

// Função para carregar um script dinâmico
function carregarScript(scriptPath) {
    return new Promise((resolve, reject) => {
        // Verifica se o script já foi carregado
        if (document.querySelector(`script[src="${scriptPath}"]`)) {
            console.log('Script já foi carregado anteriormente.');
            resolve();
            return;
        }

        // Cria o elemento script dinamicamente
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = () => {
            console.log(`Script ${scriptPath} carregado.`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Erro ao carregar o script ${scriptPath}`);
            reject();
        };

        // Adiciona o script ao body
        document.body.appendChild(script);
    });
}

// Função para carregar o HTML dinamicamente
function carregarHTML(htmlPath, elementoDestino) {
    return new Promise((resolve, reject) => {
        fetch(htmlPath)
            .then(response => response.text())
            .then(data => {
                const elemento = document.querySelector(elementoDestino);
                if (elemento) {
                    elemento.innerHTML = data;
                    console.log(`HTML ${htmlPath} carregado e adicionado.`);
                    resolve();
                } else {
                    console.error('Elemento de destino não encontrado.');
                    reject();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o HTML:', error);
                reject();
            });
    });
}

// Função para carregar o CSS dinamicamente
function carregarCSS(cssPath) {
    return new Promise((resolve, reject) => {
        // Verifica se o CSS já foi carregado
        if (document.querySelector(`link[href="${cssPath}"]`)) {
            console.log('CSS já foi carregado anteriormente.');
            resolve();
            return;
        }

        // Cria o elemento link para o CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.onload = () => {
            console.log(`CSS ${cssPath} carregado.`);
            resolve();
        };
        link.onerror = () => {
            console.error(`Erro ao carregar o CSS ${cssPath}`);
            reject();
        };

        // Adiciona o link ao head
        document.head.appendChild(link);
    });
}

// Função para verificar o parâmetro session na URL e mostrar o container
function mostrarContainerSeSession() {
    // Recupera o parâmetro 'session' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');

    // Verifica se o valor da chave 'session' é 'gestor-de-pedidos'
    if (session === 'gestor-de-pedidos') {
        const gestorContainer = document.getElementById('gestorContainer');
        if (gestorContainer) {
            gestorContainer.style.display = 'block'; // Torna o container visível

            // Carrega o HTML, CSS e o script para a seção Pedidos
            Promise.all([
                carregarHTML('./pedidos/pedidos.html', '#gestorContainer'),
                carregarCSS('./pedidos/pedidos.css'),
                carregarScript('./pedidos/pedidos.js')
            ])
                .then(() => {
                    console.log('HTML, CSS e script carregados com sucesso!');

                    // Verifica se a função exibirDadosPedidos está disponível e a chama
                    if (typeof exibirDadosPedidos === 'function') {
                        exibirDadosPedidos();
                        console.log('Função exibirDadosPedidos chamada com sucesso.');
                    } else {
                        console.error('Função exibirDadosPedidos não encontrada.');
                    }
                })
                .catch((err) => console.error('Erro ao carregar os recursos:', err));
        }
    }
}


// Chama as funções necessárias ao carregar a página
window.onload = function() {
    carregarBotoesMenu();  // Carrega os botões do menu flutuante
    mostrarContainerSeSession();  // Verifica a URL e exibe o container, se necessário
};
