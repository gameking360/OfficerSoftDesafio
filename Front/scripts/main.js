
import { apiRequest } from './api.js'
import * as criarUsuario from './Usuario.js'

//Link base, exportando para usar sempre
export const linkBase = "https://localhost:7202/api"

//Html da página de login
const pagLogin = `<div class="position-absolute top-50 start-50 translate-middle">
    <form >
        <div class="row mb-3">
          <label for="inputUser" class="col-sm-3 col-form-label">Usuario</label>
          <div class="col-sm-10">
            <input type="text" class="form-control-sm" id="inputUser" autocomplete="off">
          </div>
        </div>
        <div class="row mb-4">
          <label for="inputSenha" class="col-sm-3 col-form-label">Senha</label>
          <div class="col-sm-10">
            <input type="password" class="form-control-sm" id="inputSenha" autocomplete="off">
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary">Logar</button>
      </form>
</div>`




async function PaginaLogin(){
    
  let tokenR = sessionStorage.getItem("Token")
  if(tokenR){
    let existe = await apiRequest("/Login/Validar","POST", tokenR)

 
   
    if(existe){
       criarUsuario.CarregarPagina()
       return
    }

 }



  document.querySelector(".corpo").innerHTML = pagLogin
    let form = document.querySelector("form")
    form.addEventListener('submit',f => {
        Logar()
        f.preventDefault()
        
    })


    
}
//Tenta logar, caso dê algum erro, retorna um erro no alert
//Se bem sucedido, em Usuario está o html novo da página
async function Logar(){
    let usuarioValue = document.querySelector("#inputUser").value
    let senhaValue = document.querySelector("#inputSenha").value

    const retorno = await fetch(linkBase+"/Login", {
        method:"POST",
        body: JSON.stringify({
            usuario:usuarioValue,
            senha:senhaValue
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8"
        }
    })
    
    if(retorno.ok){
      sessionStorage.setItem("Token",await retorno.text())
      
      criarUsuario.CarregarPagina()
    }

    else{
      alert(await retorno.text())
    }

   
}



window.onload = PaginaLogin()
