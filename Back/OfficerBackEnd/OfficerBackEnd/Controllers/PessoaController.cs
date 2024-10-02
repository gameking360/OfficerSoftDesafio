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
    public class PessoaController : ControllerBase
    {
        private readonly IPessoaService pessoaService;

        public PessoaController(IPessoaService pessoaService)
        {
            this.pessoaService = pessoaService;
        }



        [HttpGet("pessoas")]

        public async Task<ActionResult<PessoaGetDTO>> GetPessoasDto()
        {
            try
            {
                var pessoas = await pessoaService.GetPessoasDto();
               
                return Ok(pessoas);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{nome}")]
        [Authorize(Roles = "admin,usuario")]
        public async Task<ActionResult<List<PessoaGetDTO>>> GetPessoasByName(string nome)
        {
            try
            {
                var pessoas = await pessoaService.GetPessoasByName(nome);

                return Ok(pessoas);

            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("cpf")]
        public async Task<ActionResult<PessoaGetDTO>> GetPessoaByCPF(string cpf)
        {
            try
            {

                var pessao = await pessoaService.GetPessoaByCPF(cpf);

                return Ok(pessao);

            }catch(Exception ex)    
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Endereco/cpf")]
        public async Task<ActionResult<Endereco>> GetEnderecoPessoa(string cpf)
        {
            try
            {
                var endereco = await pessoaService.GetPessoaEndereco(cpf);
                return Ok(endereco);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPost]
        [Authorize(Roles ="admin")]
        public async Task<IActionResult> PostPessoa(Pessoa p)
        {

            try
            {

               await pessoaService.CreatePessoa(p);
                return Ok(p);

            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpDelete]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeletePessoa(string cpf)
        {
            try
            {
                
               await pessoaService.DeletePessoaByCPF(cpf);
                return Ok("Usuário deletado com sucesso");

            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PutPessoa(string cpf, Pessoa request)
        {
            try
            {
              await pessoaService.UpdatePessoa(cpf, request);

                return Ok("Editado com sucesso");
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
