import { linkBase } from "./main.js"

const tabela = `
<table class="table">
      <thead>
        <th scope="col">CEP</th>
        <th scope="col">Endereço</th>
        <th scope="col">UF</th>
        <th scope="col">Bairro</th>
        <th scope="col">Cidade</th>
        <th scope="col">Número</th>
        <th scope="col">Complemento</th>
      </thead>
      <tbody id="tabelaEnderecos">

      </tbody>
  </table>`


async function GetEnderecos(){

   let enderecos = await fetch(linkBase+"/Endereco",{
        method:"GET",
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            "Authorization": "Bearer "+sessionStorage.getItem("Token")
        }
    }) 
    if(enderecos.ok){
        enderecos = await enderecos.json()

        enderecos.forEach(endereco => {
            document.getElementById("tabelaEnderecos").innerHTML += `
             <th scope="row">${endereco['cep'].replace(/(\d{5})(\d)/,'$1-$2')}</th>
             <td>${endereco['endereco']}</th>
             <td>${endereco['uf']}</th>
             <td>${endereco['bairro']}</th>
             <td>${endereco['municipio']}</th>
             <td>${endereco['numero']}</th>
             <td>${endereco['complemento']}</th>

            `
        });
    }
    else{
  document.querySelector("#tabelaEnderecos").innerHTML = await enderecos.text()
    }
      


}



export function CarregarPaginaEndereco(){


    document.querySelector("#enderecos").classList.add("active")
    document.querySelector("#pessoas").classList.remove("active")
    
    document.querySelector("#pesquisa").innerHTML = ""
    document.querySelector("#conteudo").innerHTML = tabela
    GetEnderecos()
}