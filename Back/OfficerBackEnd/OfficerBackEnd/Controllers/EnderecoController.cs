using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficerBackEnd.DTO_s;
using OfficerBackEnd.Models;
using OfficerBackEnd.Services.Interfaces;

namespace OfficerBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnderecoController : ControllerBase
    {
        private readonly IEnderecoService _enderecoService;

        public EnderecoController(IEnderecoService enderecoService)
        {
            _enderecoService = enderecoService;
        }





        [HttpGet]
        [Authorize(Roles = "admin,user")]
        public async Task<ActionResult<EnderecoDTO>> GetAllEnderecos()
        {
            try
            {
                var enderecos =  await _enderecoService.GetEnderecos();

                return Ok(enderecos);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("id")]
        [Authorize(Roles = "admin,user")]
        public async Task<ActionResult<Endereco>> GetEnderecoById(int id)
        {
            try
            {
                var endereco = await _enderecoService.GetEnderecoById(id);

                return Ok(endereco);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }  

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Endereco>> PostEndereco(Endereco endereco)
        {
            try
            {   

                await _enderecoService.PostEndereco(endereco);
                return Ok(endereco);

            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Checar")]
        public async Task<ActionResult<int>> CheckEndereco(string cep, int numero, string? complemento)
        {
            try
            {
                var enderecoId = await _enderecoService.CheckEndereco(numero,cep,complemento);
                return Ok(enderecoId);

            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "admin,user")]
        public async Task<IActionResult> PutEndereco(int id,  Endereco endereco)
        {
            try
            {
                await _enderecoService.PutEndereco(id, endereco);
                return Ok();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
       
    }
}
