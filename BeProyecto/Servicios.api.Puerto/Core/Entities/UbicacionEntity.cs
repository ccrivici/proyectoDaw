using MongoDB.Bson.Serialization.Attributes;

namespace Servicios.api.Puerto.Core.Entities
{
    [BsonCollection("Ubicaciones")]
    public class UbicacionEntity: Document
    {
        [BsonElement("nombre")]
        public string Nombre { get; set; }

        [BsonElement("tipo")]
        public string Tipo { get; set; }

        [BsonElement("items")]
        public List<ItemEntity>? items { get; set; }

        [BsonElement("mantenimientos")]
        public List<MantenimientoEntity>? mantenimientos { get; set; }
    }
}
