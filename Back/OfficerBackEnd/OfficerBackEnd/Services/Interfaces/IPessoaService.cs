using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;

namespace OfficerBackEnd.Services.Interfaces
{
    public interface IPessoaService
    {

        Task<Pessoa> GetPessoaById(int id);

        Task<Endereco> GetPessoaEndereco(string cpf);

        Task<List<PessoaGetDTO>> GetPessoasByName(string nome);
        Task<PessoaGetDTO> GetPessoaByCPF(string cpf);
        Task CreatePessoa(Pessoa entity);

        Task<HashSet<PessoaGetDTO>> GetPessoasDto();

        Task<Pessoa> GetEditarPessoa(string cpf);

        Task DeletePessoaByCPF(string cpf);

        Task UpdatePessoa(string cpf,  Pessoa request);
    }
}
