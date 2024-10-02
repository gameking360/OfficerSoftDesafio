using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;

namespace OfficerBackEnd.Mappers
{
    public class EnderecoMapper
    {


        public static EnderecoDTO EnderecoToDTO(Endereco endereco)
        {
            return new EnderecoDTO
            {
                UF = endereco.UF,
                endereco = endereco.endereco,
                Bairro = endereco.Bairro,
                CEP = endereco.CEP,
                Complemento = endereco.Complemento,
                Municipio = endereco.Municipio,
                Numero = endereco.Numero
            };
        }
    }
}
