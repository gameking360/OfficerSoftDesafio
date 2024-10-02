using Microsoft.AspNetCore.Identity;
using OfficerBackEnd.Data;
using OfficerBackEnd.Models;
using OfficerBackEnd.Services.Interfaces;

namespace OfficerBackEnd.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly DataContext _dataContext;
        private readonly PasswordHasher<Usuario> hasher;

        public UsuarioService(DataContext dataContext)
        {
            _dataContext = dataContext;
            hasher = new PasswordHasher<Usuario>();
        }

        public async Task CreateUser(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.cargo) || usuario.cargo == "string") usuario.cargo = "admin";

            usuario.senha = hasher.HashPassword(usuario, usuario.senha);
            

            await _dataContext.Usuarios.AddAsync(usuario);

            await _dataContext.SaveChangesAsync();
        }
    }
}
