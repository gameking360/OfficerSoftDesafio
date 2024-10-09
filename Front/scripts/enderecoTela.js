import { apiRequest } from "./api.js";

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


  //Retorna o endereço
async function GetEnderecos(){

   let enderecos = await apiRequest("/Endereco") 
    if(enderecos){
        
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
        document.querySelector("#tabelaEnderecos").innerHTML = "Não há endereços"
    }
      


}



export function CarregarPaginaEndereco(){


    document.querySelector("#enderecos").classList.add("active")
    document.querySelector("#pessoas").classList.remove("active")
    
    document.querySelector("#pesquisa").innerHTML = ""
    document.querySelector("#conteudo").innerHTML = tabela
    GetEnderecos()
}