using Microsoft.EntityFrameworkCore;
using OfficerBackEnd.Data;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Mappers;
using OfficerBackEnd.Models;
using OfficerBackEnd.Services.Interfaces;

namespace OfficerBackEnd.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly DataContext _dataContext;

        public PessoaService(DataContext dataContext) { _dataContext = dataContext; }


        public async Task CreatePessoa(Pessoa entity)
        {

            if (_dataContext.Enderecos.Find(entity.Id_Endereco) == null) throw new Exception("Endereço inexistente");
            if ( await _dataContext.Pessoas.FirstOrDefaultAsync(p => p.CPF == entity.CPF) != null) throw new Exception("Não podem existir 2 cpf's iguais");

            await _dataContext.Pessoas.AddAsync(entity);
            await _dataContext.SaveChangesAsync();

        }

     

        public async Task<Pessoa> GetPessoaById(int id)
        {
            var pessoa = await _dataContext.Pessoas.FindAsync(id);

            return pessoa;
        }

        public async Task<HashSet<PessoaGetDTO>> GetPessoasDto()
        {
            var pessoas = _dataContext.Pessoas.Select(s => PessoaMapper.PessoaToDTO(s, _dataContext)).ToHashSet();
            


            return (pessoas.Count > 0) ? pessoas : throw new Exception("Não há pessoas.");
            
        }

        public async Task DeletePessoaByCPF(string cpf)
        {
            var pessoa = await _dataContext.Pessoas.FirstOrDefaultAsync(p => p.CPF == cpf) ?? throw new Exception("Usuário não encontrado! 404");
            _dataContext.Pessoas.Remove(pessoa);
            await _dataContext.SaveChangesAsync();
        }

        public async Task UpdatePessoa(string cpf, Pessoa request)
        {
            var entity = await _dataContext.Pessoas.FirstOrDefaultAsync(p => p.CPF == cpf) ?? throw new Exception("Erro, pessoa não encontrada");
            if (cpf != request.CPF) throw new Exception("Erro! Id's diferentes");

            if (!string.IsNullOrEmpty(request.RG) && request.RG != entity.RG) entity.RG = request.RG;
            if (!string.IsNullOrEmpty(request.Nome) && request.Nome != entity.Nome) entity.Nome = request.Nome;
            if (request.Id_Endereco != entity.Id_Endereco && request.Id_Endereco != 0) entity.Id_Endereco = request.Id_Endereco;

           await _dataContext.SaveChangesAsync();
        }


        public async Task<List<PessoaGetDTO>> GetPessoasByName(string nome)
        {
            var pessoas =  await _dataContext.Pessoas.Where(p => p.Nome.ToLower().Contains(nome.ToLower())).Select(e => PessoaMapper.PessoaToDTO(e, _dataContext)).ToListAsync();

            return (pessoas.Count > 0) ? pessoas : throw new Exception("Pessoa não encontrada");
        }



        public async Task<PessoaGetDTO> GetPessoaByCPF(string cpf)
        {
            var pessoa =  await _dataContext.Pessoas.FirstAsync(p => p.CPF == cpf);
            if (pessoa == null) throw new Exception("Pessoa não existente");
            return PessoaMapper.PessoaToDTO(pessoa,_dataContext);
        }

        public async Task<Pessoa> GetEditarPessoa(string cpf)
        {
            var pessoa = await _dataContext.Pessoas.FirstAsync(p => p.CPF == cpf);
            if (pessoa == null) throw new Exception("Pessoa não existente");
            return pessoa;

        }

        public async Task<Endereco> GetPessoaEndereco(string cpf)
        {
            var pessoa = await _dataContext.Pessoas.FirstAsync(p => p.CPF == cpf);
            if (pessoa == null) throw new Exception("Pessoa não existe");

            var endereco = await _dataContext.Enderecos.FindAsync(pessoa.Id_Endereco);
            if (endereco == null) throw new Exception("Endereço não existente");

            return endereco;
        }
    }
}
