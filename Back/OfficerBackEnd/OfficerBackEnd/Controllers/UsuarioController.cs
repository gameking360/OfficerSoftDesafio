using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OfficerBackEnd.Models;
using OfficerBackEnd.Services.Interfaces;
using System.Security.Policy;

namespace OfficerBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {

        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService) {
            _usuarioService = usuarioService;
                }



        [HttpPost]
        public async Task<IActionResult> CreateUsuario(Usuario user)
        {

            await  _usuarioService.CreateUser(user);

            return Ok();
        }

    }
}
