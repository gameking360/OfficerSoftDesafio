using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;

namespace OfficerBackEnd.Services.Login
{
    public interface ILoginService
    {

        Task<string> Login(LoginDTO dto);

        bool Validar(string token);
        string GetUsuarioRole(HttpContext context);

        
    }
}
