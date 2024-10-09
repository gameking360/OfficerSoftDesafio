import { MascararCPF,getAllPessoas, getPessoas } from "./Usuario.js"

import {buscaPorCPF,buscaPorNome,templateBusca} from "../templates/templates.js"
import { apiRequest } from "./api.js"




async function buscarPorCPF(){

    if(document.querySelector("#cpfProcurado").value == ""){
       getAllPessoas()
    }

    let request = await apiRequest("/Pessoa/cpf?cpf="+document.querySelector("#cpfProcurado").value
    .replace(/-/g,'').replace(/\./g,""))

    if(request){
       
        getPessoas(request)
    }
    else{
        
        document.querySelector("#tabelaPessoas").innerHTML = `
        <div>
        Não há pessoas
        </div>
        `
    }

}
    

async function buscarPorNome(){
    if(document.querySelector("#nomeProcurado").value == ""){
        getAllPessoas()
        return
    }
    
    let request = await apiRequest("/Pessoa/"+document.querySelector("#nomeProcurado").value)

    if(request){
        document.querySelector("#tabelaPessoas").innerHTML = ""
        getPessoas(request)
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

