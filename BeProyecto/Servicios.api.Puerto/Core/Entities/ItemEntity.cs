using MongoDB.Bson.Serialization.Attributes;

namespace Servicios.api.Puerto.Core.Entities
{
    [BsonCollection("Items")]
    public class ItemEntity : Document
    {
        [BsonElement("denominacion")]
        public string? Denominacion { get; set; }

        [BsonElement("ubicacion")]
        public string? Ubicacion { get; set; }

        [BsonElement("conjuntoEquipo")]
        public string? ConjuntoEquipo { get; set; }

        [BsonElement("equipo")]
        public string? Equipo { get; set; }

        [BsonElement("marcaModelo")]
        public string? MarcaModelo { get; set; }

        [BsonElement("periocidad")]
        public string? Periocidad { get; set; }

        [BsonElement("categoria")]
        public string? Categoria { get; set; }
    }
}
