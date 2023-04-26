using MongoDB.Bson.Serialization.Attributes;

namespace Servicios.api.Puerto.Core.Entities
{
    [BsonCollection("Mantenimientos")]
    public class MantenimientoEntity: Document
    {
        [BsonElement("descripcion")]
        public string? Descripcion { get; set; }

        [BsonElement("estado")]
        public string? Estado { get; set; }

        [BsonElement("corregido")]
        public Boolean? Corregido { get; set; }

        [BsonElement("observaciones")]
        public string? Observaciones { get; set; }

        [BsonElement("ubicacion_id")]
        public string? Ubicacion_id { get; set; }

        [BsonElement("imagenes")]
        public List<string>? Imagenes { get; set; }

        [BsonElement("fecha")]
        public DateOnly? fecha { get; set; }
    }
    
}
