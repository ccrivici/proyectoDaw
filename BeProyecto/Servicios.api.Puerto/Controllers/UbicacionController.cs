using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Servicios.api.Puerto.Core.Entities;
using Servicios.api.Puerto.Repository;

namespace Servicios.api.Puerto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UbicacionController : ControllerBase
    {
        private readonly IMongoRepository<UbicacionEntity> _ubicacionRepository;


        public UbicacionController(IMongoRepository<UbicacionEntity> ubicacionRepository)
        {
            _ubicacionRepository = ubicacionRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UbicacionEntity>>> Get()
        {
            return Ok(await _ubicacionRepository.GetAll());
        }
        [HttpPost]
        public async Task Post(UbicacionEntity ubicacion)
        {
            await _ubicacionRepository.InsertDocument(ubicacion);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UbicacionEntity>> GetById(string id)
        {
            var ubicacion = await _ubicacionRepository.GetById(id);
            return Ok(ubicacion);
        }

        [HttpPut("{id}")]
        public async Task Put(string id, UbicacionEntity ubicacion)
        {
            ubicacion.id = id;
            await _ubicacionRepository.UpdateDocument(ubicacion);
        }

        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {

            await _ubicacionRepository.DeleteById(id);

        }

        [HttpPost("pagination")]

        public async Task<ActionResult<PaginationEntity<UbicacionEntity>>> PostPagination(PaginationEntity<UbicacionEntity> pagination)
        {
            //esta variable devuelve un objeto Pagination
            var resultados = await _ubicacionRepository.PaginationByFilter(
                //objeto pagination
                pagination
                );
            return Ok(resultados);
        }

    }
}
