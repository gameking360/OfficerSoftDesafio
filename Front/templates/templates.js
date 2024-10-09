export const tabelaUsuario = `
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

export const telaCriarUsuario = ` 
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

export const navegacaoSite = `  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
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



  export const templateBusca = `

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

export const buscaPorCPF = `
       <span class="input-group-text">CPF</span>
       <input type="text" class="form-control" placeholder="CPF" id="cpfProcurado">
       <button type="button" class="btn btn-primary" id="botaoBusca">Buscar</button>
`

export const buscaPorNome = `
<span class="input-group-text">Nome</span>
       <input type="text" class="form-control" placeholder="Nome" id="nomeProcurado">
           
`