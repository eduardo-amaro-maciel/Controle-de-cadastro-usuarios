let db = openDatabase('dbTips', '1.0', 'Meu primeiro banco', 2 * 1024 * 1024)

const criarBanco = (tabela) => {

    db.transaction((tx) => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS ${tabela} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                senha TEXT,
                email TEXT
            )`
        )
    })

    mostrarBanco()
} 

const deletarTabela = (tabela) => {

    db.transaction((tx) => {
        tx.executeSql(`
            DROP TABLE ${tabela}`
        )
    })
}

const inserirNoBanco = (nome, senha, email) => {

    db.transaction((tx) => {
        tx.executeSql(`
            INSERT INTO myTable 
            (nome, senha, email) 
            VALUES(?, ?, ?)`, 
            [nome, senha, email]
        )
    })

    mostrarBanco()
}

const telaEdicao = (nome, senha, email) => {

    return new Promise((resolve, reject) => {
        
        let tela = document.querySelector('.tela-de-edicao').style
        tela.display = 'flex'
    
        document.querySelector('#edit-nome').value = nome
        document.querySelector('#edit-senha').value = senha
        document.querySelector('#edit-email').value = email
    
        let cancelar = document.querySelector('#edit-cancelar')
        let confirmar = document.querySelector('#edit-confirmar')
    
        cancelar.addEventListener('click', () => {
            tela.display = 'none'
           
            resolve({
                nome: nome,
                senha: senha,
                email: email
            })
        })
    
        confirmar.addEventListener('click', () => {
            let editNome = document.querySelector('#edit-nome').value
            let editSenha = document.querySelector('#edit-senha').value
            let editEmail = document.querySelector('#edit-email').value 

            tela.display = 'none'
            resolve({
                nome: editNome,
                senha: editSenha,
                email: editEmail
            })
        })
    })   
}

const atualizarBanco = (id, editNome, editSenha, editEmail) => {

    telaEdicao(editNome, editSenha, editEmail)
        .then(e => {

            const { nome, senha, email } = e

            db.transaction((tx) => {
                tx.executeSql(`
                    UPDATE myTable 
                    SET nome=?, senha=?, email=?
                    WHERE id=?`, 
                    [nome, senha, email, id]
                )
            })
        
            mostrarBanco()
        }
    )
}

const deletarValor = (id) => {

    db.transaction((tx) => {
        tx.executeSql(`
            DELETE FROM myTable 
            WHERE id=?`, 
            [id]
        )
    })

    mostrarBanco()
}

const mostrarBanco = () => {

    let table = document.querySelector('tbody')

    db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM myTable`, [], function(_, resultado) {

            let tr = ''
            Array.from(resultado.rows).forEach(element => {
                let {id, nome, senha, email } = element
 
                tr += `<tr>`
                tr += '<td>' + id + '</td>'
                tr += '<td>' + nome + '</td>'
                tr += '<td>' + senha + '</td>'
                tr += '<td>' + email + '</td>'
                tr += '<td>' + 
                    `<input type="button" value="EDITAR" class="editar-valor" 
                        onclick="atualizarBanco(${id}, '${nome}', '${senha}', '${email}')"> 

                    <input  type="button" value="EXCLUIR" class="excluir-valor" 
                        onclick="deletarValor(${id})">` + '</td>'          
                tr += '</tr>' 
            })

            table.innerHTML = tr
        })
    })
}

document.querySelector('#delete-database')
    .addEventListener('click', (e) => {
        e.preventDefault()

        deletarTabela('myTable')

        document.location.reload(true);
    }
)

document.querySelector('form')
    .addEventListener('submit', (e) => {
        e.preventDefault()

        let form = e.target.children

        let inputNome = form.nome.value
        let inputSenha = form.senha.value
        let inputEmail = form.email.value

        form.nome.value = ''
        form.senha.value = ''
        form.email.value = ''

        inserirNoBanco(inputNome, inputSenha, inputEmail);
    }
)

criarBanco('myTable')
mostrarBanco()
