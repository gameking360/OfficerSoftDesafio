
import { linkBase } from "./main.js"
import { CarregarPaginaEndereco } from "./enderecoTela.js"
import { CarregarBusca } from "./busca.js"


const navegacaoSite = `  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
<div class = "container-fluid">
    <a class="navbar-brand">Sistema</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <ul class="navbar-nav me-auto">
      <li class="nav-item">
      <a class="nav-link" id="pessoas" href="#">Pessoas</span></a>
      </li>
      <li class = "nav-item">
      <a class="nav-link" href="#" id="enderecos">Enderecos</a>
      </li>
      </ul>
  </div>
  </div>
  </nav>
  <div class="container">
  <div class="row" id="pesquisa"> 
  </div>
  <div class="row" id="conteudo">
  </div>`

const tabelaUsuario = `
<table class="table">
    <thead>
      <th scope="col">Nome</th>
      <th scope="col">CPF</th>
      <th scope="col">RG</th>
      <th scope="col">CEP</th>
    </thead>
    <tbody id="tabelaPessoas">

    </tbody>
  </table>
  
`


const telaCriarUsuario = ` 
<div class="col">
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#criacaoUsuario" onclick='carregarModal()'>
  Criar pessoa
</button>

</div>

        <!-- Modal -->
<div class="modal fade" id="criacaoUsuario" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Criação de usuário</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
         <form id="formulario">
            <div class="mb-3">
                <label for="Nome">Nome</label>
                <input class="form-control" type="text" required name="nome" id="nome">
            </div>
            <div class="mb-3">
                <label for="CPF">CPF</label>
                <input class="form-control" type="text" required name="cpf" id="cpf" placeholder="000.000.000-00">
            </div>
            <div class="mb-3">
                <label for="RG">RG</label>
                <input class="form-control" type="text" required name="rg" id="rg">
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">CEP e Número</span>
                <input name="cep" maxlength="9" required class="form-control"  id="cep" placeholder="00000-00">
                <input type="text" name="numero" required class="form-control" id="numero" placeholder="00">
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control" name="endereco" id="endereco" placeholder="Logradouro">
                <input type="text" class="form-control" name="bairro" id="bairro" placeholder="Bairro">
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control" name="municipio" id="cidade" placeholder="Cidade">
                <input type="text" class="form-control" name="uf" id="uf" maxlength="2" placeholder="UF">
            </div>

            <div class="mb-3">
              <label for="Complemento"> Complemento</label>
              <input type="text" class="form-control" name="complemento" id="complemento">
            </div>
         </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" id="submitCriar">Criar</button>
        </div>
      </div>
    </div>
  </div>
  
`

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

async function carregarModal(){
  
  document.getElementById('cep').addEventListener('input', MascararCEP);
  document.getElementById('cpf').addEventListener('input',MascararCPF)
  document.getElementById('rg').addEventListener('input',MascararRG)

  document.querySelector("#cpf").removeAttribute('readonly')

  document.getElementById('submitCriar').replaceWith(document.getElementById('submitCriar').cloneNode(true))
  document.querySelector("#submitCriar").addEventListener('click', await CriarUsuario)

}

async function  CriarUsuario(){
let valido = ValidarForm()
  if(valido){

    
    let request = await fetch(linkBase+"/Endereco/Checar?cep="+document.getElementById('cep').value.replace(/-/g,'')+
  "&numero="+document.getElementById("numero").value+"&complemento="+document.getElementById("complemento").value)
  let id

    if(!request.ok){
      id = await CriarEndereco()
    }else{
      request = await request.json()
    }


    
    await fetch(linkBase+"/Pessoa",{
      method: "POST",
      body:JSON.stringify({
        id:0,
        nome: document.getElementById("nome").value,
        cpf:document.getElementById("cpf").value.replace(/-/g,'').replace(/\./g,""),
        rg: document.getElementById("rg").value.replace(/-/g,'').replace(/\./g,''),
        id_Endereco: (id) ? id : request
      }),
      headers:{
        "Content-type":"application/json; charset=UTF-8",
        "Authorization": "Bearer "+sessionStorage.getItem("Token")
      }
    })
    
    
    document.querySelector("#submitCriar").removeEventListener('click',CriarUsuario)
    await getAllPessoas()
  }
}

async function CriarEndereco(){
  const enderecoId = await fetch(linkBase+"/Endereco", {
    method:"POST",
    body: JSON.stringify({
      id:0,
      cep: document.getElementById('cep').value.replace(/-/g,''),
      endereco: document.getElementById('endereco').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      complemento: document.getElementById('complemento').value,
      municipio: document.getElementById('cidade').value,
      uf: document.getElementById('uf').value
    }),
    headers: {
        "Content-type":"application/json; charset=UTF-8",
        "Authorization": "Bearer "+sessionStorage.getItem("Token")
    }
  })

  if(enderecoId.ok)  {
  let id = await enderecoId.json()
 
   return id['id']
  }
  else{
    alert(await enderecoId.text())
  }
  
}

async function AbrirEditar(cpf) {

  document.getElementById('submitCriar').replaceWith(document.getElementById('submitCriar').cloneNode(true))
  document.querySelector("#submitCriar").addEventListener('click',function(){
    EditarPessoa(cpf,dbEndereco['id'])
  })

  let dbPessoa = await fetch(linkBase+'/Pessoa/cpf?cpf='+cpf,{
    method:"GET",
    headers:{
      "Content-type":"application/json; charset=UTF-8",
      "Authorization": "Bearer "+sessionStorage.getItem("Token")
    }
  })

  dbPessoa = await dbPessoa.json()
 

  let dbEndereco = await fetch(linkBase+"/Pessoa/Endereco/cpf?cpf="+dbPessoa['cpf'],{
    method:"GET",
    headers:{
      "Content-type":"application/json; charset=UTF-8",
      "Authorization": "Bearer "+sessionStorage.getItem("Token")
    }
  })

  dbEndereco = await dbEndereco.json()
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

  document.querySelector("#submitCriar").textContent = "Editar"

  
}

async function EditarPessoa(cpfPar,idEndereco) {

  
  if(ValidarForm){
    
    const enderecoDB = await fetch(linkBase+"/Endereco/id?id="+idEndereco, {
      method: "GET",
      headers: {
        "Content-type":"application/json; charset=UTF-8",
        "Authorization": "Bearer "+sessionStorage.getItem("Token")
      }
    })

    if(!enderecoDB.ok){
      alert("error \n" + await enderecoDB.text)
      return
    }
    
      const enderecoJson = await enderecoDB.json()
      

      if(enderecoJson['cep'] != document.querySelector("#cep").value.replace(/-/g,'')){
        idEndereco = await fetch(linkBase+"/Endereco/Checar?cep="+document.getElementById('cep').value.replace(/-/g,'')+
        "&numero="+document.getElementById("numero").value+"&complemento="+document.getElementById("complemento").value)
      
        if(!idEndereco.ok){
          idEndereco = await CriarEndereco()
        }
      }
      else{
        let request = await fetch(linkBase+"/Endereco?id="+idEndereco, {
          method: "PUT",
          body: JSON.stringify({
            id:idEndereco,
            cep: document.querySelector('#cep').value.replace(/-/g,''),
            endereco: document.querySelector('#endereco').value,
            numero: document.querySelector("#numero").value,
            bairro: document.querySelector("#bairro").value,
            complemento: document.querySelector("#complemento").value,
            municipio: document.querySelector("#cidade").value,
            uf: document.querySelector("#uf").value
          }),
          headers: {
            "Content-type":"application/json; charset=UTF-8",
            "Authorization": "Bearer "+sessionStorage.getItem("Token")
          }
        })

        
        
      }

    
      let request = await fetch(linkBase+"/Pessoa?cpf="+cpfPar, {
      method:"PUT",
      body:JSON.stringify({
        id:0,
        nome: document.querySelector("#nome").value,
        cpf: cpfPar,
        rg: document.querySelector("#rg").value.replace(/-/g,'').replace(/\./g,''),
        idEndereco: idEndereco,
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8",
        "Authorization": "Bearer "+sessionStorage.getItem("Token")
      }
    })
  }

  document.querySelector("#submitCriar").removeEventListener('click',AbrirEditar)
  document.querySelector("#cpf").setAttribute('readonly',false)
  await getAllPessoas()

}

function ValidarForm(){

let errorMessage = "";

let form = document.querySelectorAll("#formulario input")
form.forEach(item => {
  if(item.value == "" && item.name != "Complemento") {
    errorMessage+= "Campo " + item.name + " não pode ser nulo!\n"
    
  }  
  })

  if(errorMessage != ""){
    alert(errorMessage)
    return false
  }

return true
}

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


export const MascararCPF = (event) => {
  let input = event.target

  if(!input.value) input.value = ""
  if(input.value.length > 12) input.value = input.value.substr(0,14)

  input.value = input.value.replace(/\D/g,'')
  input.value = input.value.replace(/(\d{3})(\d)/,"$1.$2")
  input.value = input.value.replace(/(\d{3})(\d)/,"$1.$2")

  input.value = input.value.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
}

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

let request = await fetch(linkBase+"/Pessoa/pessoas", {
  method:"GET",
  headers: {
    "Content-type":"application/json; charset=UTF-8",
    "Authorization": "Bearer "+sessionStorage.getItem("Token")
  }
})

if(request.ok){
  document.querySelector("#tabelaPessoas").innerHTML = ""
  const pessoas = await request.json()

  getPessoas(pessoas)
}
else{
  document.querySelector("#tabelaPessoas").innerHTML = await request.text()
}

}

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



async function deletarPessoa(cpf){

  let request = await fetch(linkBase+"/Pessoa?cpf="+cpf,{
    method:"DELETE",
    headers:{
    "Content-type":"application/json; charset=UTF-8",
    "Authorization": "Bearer "+sessionStorage.getItem("Token")
    }
  })

  if(request.ok){

    alert(await request.text())
    getAllPessoas()
  }

}

export function CarregarPagina(){
  
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

