using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OfficerBackEnd.Data;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OfficerBackEnd.Services.Login
{
    public class LoginService : ILoginService
    {
        private readonly DataContext _dataContext;
        private readonly PasswordHasher<Usuario> hasher;
        private readonly IConfiguration _config;

        public LoginService(DataContext dataContext, IConfiguration config)
        {
            _dataContext = dataContext;
            hasher = new PasswordHasher<Usuario>();
            _config = config;
        }


        public bool Validar(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadJwtToken(token);

            Console.WriteLine(tokenS.ValidTo);
            Console.WriteLine(tokenS.ValidFrom);

            if(tokenS.ValidTo > DateTime.UtcNow)
            {
                return true;
            }
            return false;
        }

        public string GetUsuarioRole(HttpContext context)
        {
            throw new NotImplementedException();
        }

        private async Task<Usuario?> GetUsuario(LoginDTO dto)
        {
           return await _dataContext.Usuarios.FirstOrDefaultAsync(u => u.usuario == dto.usuario);
        }

        public async Task<string> Login(LoginDTO dto)
        {
            Usuario? user = await GetUsuario(dto);
            if (user is null) throw new Exception("Usuário inexistente");

            if (hasher.VerifyHashedPassword(user, user.senha, dto.senha) == 0) throw new Exception("Senha incorreta");

            return GerarToken(user);
         

        }

        private string GerarToken(Usuario user)
        {
            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));
            SigningCredentials credentials = new(key,SecurityAlgorithms.HmacSha512Signature);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.usuario),
                new Claim(ClaimTypes.Role,user.cargo)
            };

            JwtSecurityToken token = new(
                _config["JWT:Issuer"],
                _config["JWT:Audience"],
                claims,
                signingCredentials: credentials,
                expires: DateTime.Now.AddDays(3));

            

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
