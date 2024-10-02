using OfficerBackEnd.Models;

namespace OfficerBackEnd.Services.Interfaces
{
    public interface IUsuarioService
    {

        Task CreateUser(Usuario usuario);
    }
}
