using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;

namespace OfficerBackEnd.Services.Interfaces
{
    public interface IEnderecoService
    {
        Task<Endereco> GetEnderecoById(int id);
        Task PostEndereco(Endereco endereco);

        Task<HashSet<EnderecoDTO>> GetEnderecos();

        Task<Endereco> GetEnderecoByCEP(string cep, int numero);
        Task<int> CheckEndereco(int numero, string cep, string complemento);

        Task PutEndereco(int id,  Endereco endereco);
    }
}
