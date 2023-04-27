using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Servicios.api.Puerto.Core.Entities;
using Servicios.api.Puerto.Repository;

namespace Servicios.api.Puerto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MantenimientoController : ControllerBase
    {
        private readonly IMongoRepository<MantenimientoEntity> _mantenimientoRepository;

        public MantenimientoController(IMongoRepository<MantenimientoEntity> mantenimientoRepository)
        {
            _mantenimientoRepository = mantenimientoRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MantenimientoEntity>>> Get()
        {
            return Ok(await _mantenimientoRepository.GetAll());
        }
        [HttpPost]
        public async Task<OkObjectResult> Post(MantenimientoEntity mantenimiento)
        {
           
            await _mantenimientoRepository.InsertDocument(mantenimiento);
            return Ok(mantenimiento);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MantenimientoEntity>> GetById(string id)
        {
            var mantenimiento = await _mantenimientoRepository.GetById(id);
            return Ok(mantenimiento);
        }

        [HttpPut("{id}")]
        public async Task Put(string id, MantenimientoEntity mantenimiento)
        {
            mantenimiento.id = id;
            await _mantenimientoRepository.UpdateDocument(mantenimiento);
        }

        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {

            await _mantenimientoRepository.DeleteById(id);

        }

        [HttpPost("pagination")]

        public async Task<ActionResult<PaginationEntity<MantenimientoEntity>>> PostPagination(PaginationEntity<MantenimientoEntity> pagination)
        {
            //esta variable devuelve un objeto Pagination
            var resultados = await _mantenimientoRepository.PaginationByFilter(
                //objeto pagination
                pagination
                );
            return Ok(resultados);
        }
    }
}
