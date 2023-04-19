using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Servicios.api.Puerto.Core.Entities
{
    public class Document : IDocument
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }
    }
}
