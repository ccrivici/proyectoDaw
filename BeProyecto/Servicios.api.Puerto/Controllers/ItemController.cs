using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Servicios.api.Puerto.Core.Entities;
using Servicios.api.Puerto.Repository;

namespace Servicios.api.Puerto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IMongoRepository<ItemEntity> _itemRepository;
        private readonly MongoRepository<ItemEntity> _itemCollection;


        public ItemController(IMongoRepository<ItemEntity> itemRepository)
        {
            _itemRepository = itemRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemEntity>>> Get()
        {
            return Ok(await _itemRepository.GetAll());
        }
        [HttpPost]
        public async Task Post(ItemEntity item)
        {
            await _itemRepository.InsertDocument(item);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemEntity>> GetById(string id)
        {
            var item = await _itemRepository.GetById(id);
            return Ok(item);
        }
        

        [HttpPut("{id}")]
        public async Task Put(string id, ItemEntity item)
        {
            item.id = id;
            await _itemRepository.UpdateDocument(item);
        }

        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {

            await _itemRepository.DeleteById(id);

        }

        [HttpPost("pagination")]

        public async Task<ActionResult<PaginationEntity<ItemEntity>>> PostPagination(PaginationEntity<ItemEntity> pagination)
        {
            //esta variable devuelve un objeto Pagination
            var resultados = await _itemRepository.PaginationByFilter(
                //objeto pagination
                pagination
                );
            return Ok(resultados);
        }

    }
}
