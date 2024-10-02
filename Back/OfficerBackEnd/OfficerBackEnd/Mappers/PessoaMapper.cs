using OfficerBackEnd.Data;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;

namespace OfficerBackEnd.Mappers
{
    public class PessoaMapper
    {

       

        public static PessoaGetDTO PessoaToDTO(Pessoa entity, DataContext _dataContext)
        {
            PessoaGetDTO dto = new PessoaGetDTO();
            dto.Nome = entity.Nome;

            dto.CEP = _dataContext.Enderecos.Find(entity.Id_Endereco).CEP;

            dto.RG = entity.RG;
            dto.CPF = entity.CPF;

            return dto;
        }
    }
}
