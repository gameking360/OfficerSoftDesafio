
import { CarregarPaginaEndereco } from "./enderecoTela.js"
import { CarregarBusca } from "./busca.js"
import {apiRequest} from "./api.js"

import {navegacaoSite,tabelaUsuario,telaCriarUsuario} from "../templates/templates.js"

//Limpa o formulário e seus dados
function limparForm(){
  setTimeout(function() {
    let form = document.querySelectorAll("#formulario input")
    document.querySelector("#submitCriar").textContent = "Criar"
    form.forEach(item => {
      item.value = ""
    })
    document.querySelector("#submitCriar").removeEventListener('click',CriarUsuario)
  },300)
  
}

//Carrega o modal e passa as funções necessárias para ele
async function carregarModal(){
  
  document.getElementById('cep').addEventListener('input', MascararCEP);
  document.getElementById('cpf').addEventListener('input',MascararCPF)
  document.getElementById('rg').addEventListener('input',MascararRG)
  document.getElementById('numero').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g,'')
    
  })

  document.querySelector("#cpf").removeAttribute('readonly')

  document.getElementById('submitCriar').replaceWith(document.getElementById('submitCriar').cloneNode(true))
  document.querySelector("#submitCriar").addEventListener('click', await CriarUsuario)

}

//Tenta criar o usuário
async function  CriarUsuario(){
let valido = ValidarForm()
  if(valido){

    let id;

    let request =  await apiRequest("/Endereco/Checar?cep="+document.getElementById('cep').value.replace(/-/g,'')+
  "&numero="+document.getElementById("numero").value+"&complemento="+document.getElementById("complemento").value)
  
  
    if(!request){
      id = await CriarEndereco()
    }
   
     
    let pessoa = await apiRequest("/Pessoa","POST",{
        id:0,
        nome: document.getElementById("nome").value,
        cpf:document.getElementById("cpf").value.replace(/-/g,'').replace(/\./g,""),
        rg: document.getElementById("rg").value.replace(/-/g,'').replace(/\./g,''),
        id_Endereco: (id) ? id : request
      })
     
 

    if(pessoa){
      document.querySelector("#submitCriar").removeEventListener('click',CriarUsuario)
      await getAllPessoas()
    }
    
    
  }
}

//Tenta criar um nove endereço, caso dê certo, retorna o id do endereço
async function CriarEndereco(){
  
  const enderecoId = await apiRequest("/Endereco","POST", {
      id:0,
      cep: document.getElementById('cep').value.replace(/-/g,''),
      endereco: document.getElementById('endereco').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      complemento: document.getElementById('complemento').value,
      municipio: document.getElementById('cidade').value,
      uf: document.getElementById('uf').value
    })

  if(enderecoId)  {
  return enderecoId.id
  }

  
}

//Abre o modal, porém na opção de editar
async function AbrirEditar(cpf) {

  document.getElementById('submitCriar').replaceWith(document.getElementById('submitCriar').cloneNode(true))
  document.querySelector("#submitCriar").addEventListener('click',function(){
    EditarPessoa(cpf,dbEndereco['id'])
  })

  let dbPessoa = await apiRequest('/Pessoa/cpf?cpf='+cpf)
  let dbEndereco = await apiRequest("/Pessoa/Endereco/cpf?cpf="+dbPessoa['cpf'])

 
  let form = document.querySelectorAll("#formulario input")
  form.forEach(item => {
    if(dbPessoa.hasOwnProperty(item.name)){
      item.value = dbPessoa[item.name]
    }
    else{
      item.value = dbEndereco[item.name]
    }

  })

  document.querySelector("#cpf").setAttribute("readonly",true)
  document.querySelector("#cpf").value = document.querySelector("#cpf").value.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2")
  .replace(/(\d{3})(\d{1,2})$/,"$1-$2")


  document.querySelector("#cep").value = MascaradoCEP(document.querySelector("#cep").value)
  document.querySelector("#rg").value = document.querySelector("#rg").value.
  replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2")
  .replace(/(\d{3})(\d)/,"$1-$2")

  document.querySelector("#submitCriar").textContent = "Editar"

  
}

//Tenta editar a pessoa
async function EditarPessoa(cpfPar,idEndereco) {

  
  if(ValidarForm){
    
        
    const enderecoDB = await apiRequest("/Endereco/id?id="+idEndereco)

    if(!enderecoDB){
      return
    }
            

      if(enderecoDB['cep'] != document.querySelector("#cep").value.replace(/-/g,'')){
        idEndereco = await apiRequest("/Endereco/Checar?cep="+document.getElementById('cep').value.replace(/-/g,'')+
        "&numero="+document.getElementById("numero").value+"&complemento="+document.getElementById("complemento").value)
      
        if(!idEndereco){
          idEndereco = await CriarEndereco()
        }
        
      }
      else{
        
        await apiRequest("/Endereco?id="+idEndereco, "PUT", {
         
            id:(idEndereco.id) ? idEndereco.id : idEndereco,
            cep: document.querySelector('#cep').value.replace(/-/g,''),
            endereco: document.querySelector('#endereco').value,
            numero: document.querySelector("#numero").value,
            bairro: document.querySelector("#bairro").value,
            complemento: document.querySelector("#complemento").value,
            municipio: document.querySelector("#cidade").value,
            uf: document.querySelector("#uf").value
          })  
        
      }

      //Atualiza a pessoa
      let request = await apiRequest("/Pessoa?cpf="+cpfPar, "PUT", {
      
        id:0,
        nome: document.querySelector("#nome").value,
        cpf: cpfPar,
        rg: document.querySelector("#rg").value.replace(/-/g,'').replace(/\./g,''),
        id_Endereco: idEndereco,
      })

    if(request){
      document.querySelector("#submitCriar").removeEventListener('click',AbrirEditar)
      document.querySelector("#cpf").setAttribute('readonly',false)
      await getAllPessoas()
    }
    else{
      alert("Erro ao editar a pessoa")
    }
      
  }

 
}

//Verifica se o form está válido ou não
function ValidarForm(){

let errorMessage = "";

//Verifica se todos os campos possuem valor
let form = document.querySelectorAll("#formulario input")
form.forEach(item => {
  if(item.value == "" && item.name != "Complemento") {
    errorMessage+= "Campo " + item.name + " não pode ser nulo!\n"
    
  }  
  })

  //Validação do CPF
  const cpfValue = document.getElementById("cpf").value.replace(/\D/g, '');
  if (cpfValue.length !== 11) {
    errorMessage += "O CPF deve conter 11 dígitos!\n";
  }

  // Validação do CEP
  const cepValue = document.getElementById("cep").value.replace(/\D/g, '');
  if (cepValue.length !== 8) {
    errorMessage += "O CEP deve conter 8 dígitos!\n";
  }


  const rgValue = document.getElementById("rg").value.replace(/\D/g,'');
  if(rgValue.length !== 9){
    errorMessage += "O RG deve conter 8 dígitos!\n"
  }

  if(errorMessage != ""){
    alert(errorMessage)
    return false
  }


return true
}


//Mascara o CEP
export const  MascararCEP = (event) => {
    
    let input = event.target
    
    input.value = MascaradoCEP(input.value)

    if(input.value.length >= 9) {
      input.value = input.value.substr(0,9)
    {
       fetch("https://viacep.com.br/ws/"+input.value+"/json/")
       .then((request) => request.json())
       .then((json) => {
        document.getElementById('bairro').value = json['bairro']
        document.getElementById('uf').value = json['uf']
        document.getElementById('cidade').value = json['localidade']
        document.getElementById('endereco').value = json['logradouro']
       })
    }
  }
}

//Mascara o CPF
export const MascararCPF = (event) => {
  let input = event.target

  if(!input.value) input.value = ""
  if(input.value.length > 12) input.value = input.value.substr(0,14)

  input.value = input.value.replace(/\D/g,'')
  input.value = input.value.replace(/(\d{3})(\d)/,"$1.$2")
  input.value = input.value.replace(/(\d{3})(\d)/,"$1.$2")

  input.value = input.value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
}


//Mascara o RG
export const MascararRG = (event) => {
  let input = event.target
  if(!input.value) input.value = ""
  if(input.value.length > 11) input.value = input.value.substr(0,12)

  input.value = input.value.replace(/\D/g,'')
  input.value = input.value.replace(/(\d{2})(\d)/,"$1.$2")
  input.value = input.value.replace(/(\d{3})(\d)/,"$1.$2")
  input.value = input.value.replace(/(\d{3})(\d)/,"$1-$2")
}


function MascaradoCEP(value){

    if(!value) return ""

    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{5})(\d)/,'$1-$2')
    return value
}

export async  function getAllPessoas(){

let request = await apiRequest("/Pessoa/pessoas")

if(request){
  document.querySelector("#tabelaPessoas").innerHTML = ""
  
  getPessoas(request)
}

}

//Função base para get pessoas, recebe o pessoas de suas variantes
export function getPessoas(pessoas){
  
  if(Array.isArray(pessoas)){

  
  pessoas.forEach(pessoa => {
    let cpfPessoa = pessoa['cpf'].replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    let rgPessoa = pessoa['rg'].replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1-$2")
    
    document.querySelector("#tabelaPessoas").innerHTML += `
             <th scope="row">${pessoa['nome']}</th>
             <td>${cpfPessoa}</td>
             <td>${rgPessoa}</td>
             <td>${pessoa['cep'].replace(/(\d{5})(\d)/,'$1-$2')}</td>
              <td> 
              <button type="button" class="btn btn-info" data-bs-toggle="modal"  data-bs-target="#criacaoUsuario" onclick=AbrirEditar('${pessoa['cpf']}')> Editar </button> 
               <button type="button" class="btn btn-danger" onclick=deletarPessoa('${pessoa['cpf']}')>Deletar</button>
              </td>
             
             
    `
  })
}
  else{
    document.querySelector("#tabelaPessoas").innerHTML = `
        <th scope="row">${pessoas['nome']}</th>
             <td>${pessoas['cpf'].replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")}</td>
             <td>${pessoas['rg']}</td>
             <td>${pessoas['cep'].replace(/(\d{5})(\d)/,'$1-$2')}</td>
             <td> <button type="button" class="btn btn-info"> Editar </button>
              <button type="button" class="btn btn-danger" onclick=deletarPessoa('${pessoas['cpf']}')>Deletar</button> </td>
        `
  }

}


//Como cpf é uma chave primária, deleta pelo cpf
async function deletarPessoa(cpf){

  let request = await apiRequest("/Pessoa?cpf="+cpf, "DELETE")

  if(request){

    alert(request)
    getAllPessoas()
  }


}
//Pré-carrega as funções para conseguir realizar a chamada delas
//Define o html inicial da página
export function CarregarPagina(){
  
  //Funções globais
  window.deletarPessoa = deletarPessoa
  window.AbrirEditar = AbrirEditar
  window.limparForm = limparForm
  window.carregarModal = carregarModal
  


  document.querySelector(".corpo").innerHTML = navegacaoSite
  document.querySelector("#pesquisa").innerHTML += telaCriarUsuario
  CarregarBusca()
  
  document.querySelector("#conteudo").innerHTML += tabelaUsuario

  const myModal = document.querySelector("#criacaoUsuario")
  myModal.addEventListener('hidden.bs.modal',limparForm)
  carregarModal()


  getAllPessoas()

  document.querySelector("#pessoas").classList.add("active")
  document.querySelector("#enderecos").classList.remove("active")
  
  document.querySelector("#enderecos").addEventListener("click",CarregarPaginaEndereco)
  document.querySelector("#pessoas").addEventListener("click",CarregarPagina)

  
}

