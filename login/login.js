const toggleForm = document.getElementById("toggle-form");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");

toggleForm.addEventListener("click", () => {
    const isLoginVisible = !loginForm.classList.contains("hidden");

    loginForm.classList.toggle("hidden", isLoginVisible);
    signupForm.classList.toggle("hidden", !isLoginVisible);
    formTitle.textContent = isLoginVisible ? "Cadastro" : "Login";
    toggleForm.textContent = isLoginVisible 
        ? "Já tem conta? Faça login!"
        : "Não tem conta? Cadastre-se!";
});


loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const payload = { email, password };

    try {
        const response = await fetch("https://backend.pedepro.com.br/api/rest/login/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": "dz9uee0D8fyyYzQsv2piE1MLcVZklkc7"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.user[0].token;
            localStorage.setItem("userToken", token);

            alert("Login bem-sucedido!");
        } else {
            const errorDetails = await response.json(); // Tenta obter detalhes do erro
            console.error("Erro no login:", errorDetails);
            alert(`Erro no login: ${errorDetails.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão. Verifique sua internet.");
    }
});

// Função para capturar os dados do formulário de cadastro
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // Captura os valores dos campos do formulário
    const name = document.querySelector('#signup-form input[type="text"]').value;
    const email = document.querySelector('#signup-form input[type="email"]').value;
    const phone = document.querySelector('#signup-form input[type="text"][placeholder="Telefone"]').value; // Campo de telefone
    const password = document.querySelector('#signup-form input[type="password"]').value;

    // Monta o corpo da requisição
    const requestBody = {
        email: email,
        password: password,
        name: name,
        phone: phone
    };

    // Cabeçalhos da requisição
    const headers = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "dz9uee0D8fyyYzQsv2piE1MLcVZklkc7"
    };

    // Realiza a requisição POST para a API de cadastro
    fetch('https://backend.pedepro.com.br/api/rest/creater/user', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.insert_user_one) {
            // Se a resposta for bem-sucedida, o token será armazenado
            const token = data.insert_user_one.token;
            localStorage.setItem('userToken', token);

            // Pode redirecionar o usuário ou mostrar uma mensagem de sucesso
            alert('Cadastro realizado com sucesso!');
            window.location.href = "login.html"; // Exemplo de redirecionamento
        } else {
            // Caso haja algum erro
            alert('Erro no cadastro. Tente novamente.');
        }
    })
    .catch(error => {
        // Tratar erro na requisição
        console.error('Erro ao realizar o cadastro:', error);
        alert('Erro ao realizar o cadastro. Tente novamente.');
    });
});

