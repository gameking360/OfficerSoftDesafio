using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OfficerBackEnd.Models
{
    [Table("Usuario")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string usuario { get; set; } = string.Empty;
        public string senha { get; set; } = string.Empty;

        public string cargo { get; set; } = string.Empty;
    }
}
