using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficerBackEnd.Models
{
    [Table("Endereco")]
    public class Endereco
    {
        [Key]
        public int Id { get; set; }
        public string CEP { get; set; } = string.Empty;
        public string endereco { get; set; } = string.Empty;
        public int Numero { get; set; }
        public string Bairro { get; set; } = string.Empty;
        public string Complemento { get; set; } = string.Empty;
        public string Municipio { get; set; } = string.Empty;
        public string UF { get; set; } = string.Empty;
    }
}
