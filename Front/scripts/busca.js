import { linkBase } from "./main.js"
import { MascararCPF,getAllPessoas, getPessoas } from "./Usuario.js"


const templateBusca = `

<div class="input-group col" id="campoBuscado">
    
    <div class="form-check" id="divMudarCPF">
        <label class="form-check-label" for="mudarCPF">
          CPF
        </label>
        <input class="form-check-input" type="checkbox" name="mudarCPF" id="mudarCPF">
        
      </div>
      <div class="input-group col" id="campoMudar">
       
       </div>
    
    </div>
    
    `

const buscaPorCPF = `
       <span class="input-group-text">CPF</span>
       <input type="text" class="form-control" placeholder="CPF" id="cpfProcurado">
       <button type="button" class="btn btn-primary" id="botaoBusca">Buscar</button>
`

const buscaPorNome = `
<span class="input-group-text">Nome</span>
       <input type="text" class="form-control" placeholder="Nome" id="nomeProcurado">
           
`


async function buscarPorCPF(){

    if(document.querySelector("#cpfProcurado").value == ""){
       getAllPessoas()
    }

    let request = await fetch(linkBase+"/Pessoa/cpf?cpf="+document.querySelector("#cpfProcurado").value
    .replace(/-/g,'').replace(/\./g,""),{
        method:"GET",
        headers: {
            "Content-type":"application/json; charset=UTF-8",
            "Authorization": "Bearer "+sessionStorage.getItem("Token")
        }
    })

    if(request.ok){
       
        
        let pessoa = await request.json()

        getPessoas(pessoa)
    }
    else{
        
        document.querySelector("#tabelaPessoas").innerHTML = `
        <div>
        ${await request.text()}
        </div>
        `
    }

}
    

async function buscarPorNome(){
    if(document.querySelector("#nomeProcurado").value == ""){
        getAllPessoas()
        return
    }
    
    let request = await fetch(linkBase+"/Pessoa/"+document.querySelector("#nomeProcurado").value,{
        method:"GET",
        headers: {
            "Content-type":"application/json; charset=UTF-8",
            "Authorization": "Bearer "+sessionStorage.getItem("Token")
        }
    })

    if(request.ok){
        document.querySelector("#tabelaPessoas").innerHTML = ""

        let pessoas = await request.json()
        getPessoas(pessoas)
    }

    else{

    document.getElementById("tabelaPessoas").innerHTML = `
    <div> Nenhum usuário encontrado
    </div>
    `

    }
}


function mudarFuncao(){

if(document.querySelector("#mudarCPF").checked){
    document.querySelector("#campoMudar").innerHTML = buscaPorCPF
    document.getElementById('cpfProcurado').addEventListener('input',MascararCPF)
    document.getElementById("botaoBusca").addEventListener('click',buscarPorCPF)
    getAllPessoas()


}
else{
    document.querySelector("#campoMudar").innerHTML = buscaPorNome
    document.querySelector("#nomeProcurado").addEventListener('input',buscarPorNome)

    getAllPessoas()

}

}



export function CarregarBusca(){

    document.querySelector("#pesquisa").innerHTML += templateBusca
    
    document.querySelector("#mudarCPF").addEventListener('input',mudarFuncao)
    document.getElementById("campoMudar").innerHTML = buscaPorNome

    document.querySelector("#nomeProcurado").addEventListener('input',buscarPorNome)

}

