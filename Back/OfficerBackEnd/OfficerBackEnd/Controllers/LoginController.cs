using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Services.Login;

namespace OfficerBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _login;

        public LoginController(ILoginService login)
        {
            _login = login;
        }

        
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<string>> Login(LoginDTO dto)
        {
            try
            {
                string token = await _login.Login(dto);

                return Ok(token);

            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Recebe o token que está armazenado,e o valida.
        [AllowAnonymous]
        [HttpPost("Validar")]
        public ActionResult<bool> Validar([FromBody] string token)
        {
            if(_login.Validar(token))
            {
                return Ok(true);
            }
            return BadRequest(false);
        }
    }
}
