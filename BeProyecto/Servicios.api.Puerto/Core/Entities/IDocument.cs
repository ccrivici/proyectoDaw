using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Servicios.api.Puerto.Core.Entities
{
    public interface IDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        string id { get; set; }

    }
}
