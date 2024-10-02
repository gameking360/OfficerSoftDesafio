using Microsoft.EntityFrameworkCore;
using OfficerBackEnd.Data;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Mappers;
using OfficerBackEnd.Models;
using OfficerBackEnd.Services.Interfaces;

namespace OfficerBackEnd.Services
{

    public class EnderecoService : IEnderecoService
    {
        private readonly DataContext _dataContext;

        public EnderecoService(DataContext dataContext) { _dataContext = dataContext; }

        public async Task<int> CheckEndereco(int numero, string cep, string complemento)
        {


            var endereco = await _dataContext.Enderecos.FirstOrDefaultAsync(e => e.Numero == numero && e.CEP == cep && e.Complemento == complemento);


            if(endereco == null) throw new Exception("Endereço não existente");

            return endereco.Id;


          
        }

        public async Task<Endereco> GetEnderecoByCEP(string cep, int numero)
        {
            var enderco = await _dataContext.Enderecos.FirstOrDefaultAsync(e => e.CEP == cep && e.Numero == numero ) ?? throw new Exception("Endereço não cadastrado");


            return enderco;
        }

        public async Task<Endereco> GetEnderecoById(int id)
        {
            var endereco = await _dataContext.Enderecos.FindAsync(id);
            if (endereco == null) throw new Exception("Endereço não existe");

            return endereco;
    
        }

        public async Task<HashSet<EnderecoDTO>> GetEnderecos()
        {
            var enderecos = _dataContext.Enderecos.ToHashSet();
           var retorno =  enderecos.Select(e => EnderecoMapper.EnderecoToDTO(e)).ToHashSet();

            if (retorno.Count == 0) throw new Exception("Nenhum endereço");

            return retorno;
        }

        public async Task PostEndereco(Endereco endereco)
        {

            await _dataContext.Enderecos.AddAsync(endereco);

            await _dataContext.SaveChangesAsync();
        }

        public async Task PutEndereco(int id, Endereco endereco)
        {
            var enderecoDB = await _dataContext.Enderecos.FindAsync(id);

            if (id != endereco.Id) throw new Exception("Id's diferentes");
            else if (id == 0) throw new Exception("Id não pode ser nulo");
            else if (enderecoDB is null) throw new Exception("Endereço não existe no banco");

            if (endereco.Complemento != enderecoDB.Complemento && !string.IsNullOrEmpty(endereco.Complemento)) enderecoDB.Complemento = endereco.Complemento;
            if (endereco.Numero != enderecoDB.Numero && endereco.Numero != 0) enderecoDB.Numero = endereco.Numero;
            if (endereco.Bairro != enderecoDB.Bairro && !string.IsNullOrEmpty(endereco.Bairro)) enderecoDB.Bairro = endereco.Bairro;
            if (endereco.endereco != enderecoDB.endereco && !string.IsNullOrEmpty(endereco.endereco)) enderecoDB.endereco = endereco.endereco;
            if (endereco.UF != enderecoDB.UF && !string.IsNullOrEmpty(endereco.UF)) enderecoDB.UF = endereco.UF;
            if (endereco.Municipio != enderecoDB.Municipio && !string.IsNullOrEmpty(endereco.Municipio)) enderecoDB.Municipio = endereco.Municipio;


            await _dataContext.SaveChangesAsync();
        }
    }
}
