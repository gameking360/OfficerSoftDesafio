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


        //Verifica se o tempo atual é menor que o tempo do token, se for retorna true e indica que o token é válido
        public bool Validar(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadJwtToken(token);


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

        //Retorna o usuário que tenha o mesmo nome que o passado
        private async Task<Usuario?> GetUsuario(LoginDTO dto)
        {
           return await _dataContext.Usuarios.FirstOrDefaultAsync(u => u.usuario == dto.usuario);
        }


        //Utiliza uma classe externa (PasswordHasher) para verificar se a senha que recebeu, é a mesma da senha que está no banco
        //Se for, gera um token
        public async Task<string> Login(LoginDTO dto)
        {
            Usuario? user = await GetUsuario(dto);
            if (user is null) throw new Exception("Usuário inexistente");

            if (hasher.VerifyHashedPassword(user, user.senha, dto.senha) == 0) throw new Exception("Senha incorreta");

            return GerarToken(user);
         

        }

        //Obtem a key que está no appseting
        //Cria as credenciais de acordo com a key e o algoritmo de segurança
        //Cria as clains que eu quero retornar
        //Enfim cria o token
        //Ao fim, escreve e retorna o token
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
