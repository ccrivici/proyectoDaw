using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Servicios.api.Puerto.Core;
using Servicios.api.Puerto.Core.Entities;
using System.Linq.Expressions;

namespace Servicios.api.Puerto.Repository
{
    public class MongoRepository<TDocument> : IMongoRepository<TDocument> where TDocument : IDocument
    {
        private readonly IMongoCollection<TDocument> _collection;
        private readonly IMongoCollection<ItemEntity> _itemCollection;

        public MongoRepository(IOptions<MongoSettings> options)
        {
            var client = new MongoClient(options.Value.ConnectionString);
            var db = client.GetDatabase(options.Value.Database);
            _collection = db.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));

        }

        //este método devuelve el nombre de la colección pasandole el document type
        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(typeof(BsonCollectionAttribute), true).FirstOrDefault()).CollectionName;

        }

        //devuelve todos los metodos de la coleccion
        public async Task<IEnumerable<TDocument>> GetAll()
        {
            return (IEnumerable<TDocument>)await _collection.Find(p => true).ToListAsync();
        }
        

        public async Task InsertDocument(TDocument document)
        {
            
            await _collection.InsertOneAsync(document);

        }
        
        public async Task<TDocument> GetById(string Id)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, Id);
            return await _collection.Find(filter).SingleOrDefaultAsync();
        }
       


        public async Task UpdateDocument(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, document.id);
            await _collection.FindOneAndReplaceAsync(filter, document);
        }

        public async Task DeleteById(string Id)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, Id);
            await _collection.FindOneAndDeleteAsync(filter);

        }

        public async Task<PaginationEntity<TDocument>> PaginationBy(Expression<Func<TDocument, bool>> filterExpression, PaginationEntity<TDocument> pagination)
        {
            var sort = Builders<TDocument>.Sort.Ascending(pagination.Sort);
            if (pagination.SortDirection == "desc")
            {
                sort = Builders<TDocument>.Sort.Descending(pagination.Sort);
            }
            if (string.IsNullOrEmpty(pagination.Filter))
            {
                pagination.Data = await _collection.Find(p => true) //con p=> true indicamos que muestre todos los datos
                        .Sort(sort)
                        //skip permite fijar una posición en la lista de records que devuelve la base de datos y tomar los siguientes elementos
                        .Skip((pagination.Page - 1) * (pagination.PageSize))
                        //limit indica el número de elementos que deve devolver la base de datos
                        .Limit(pagination.PageSize)
                        .ToListAsync();
            }
            else
            {
                pagination.Data = await _collection.Find(filterExpression) //aqui indicamos que muestre los datos que sigan el filterExpresion
                        .Sort(sort)
                        //skip permite fijar una posición en la lista de records que devuelve la base de datos y tomar los siguientes elementos
                        .Skip((pagination.Page - 1) * (pagination.PageSize))
                        //limit indica el número de elementos que deve devolver la base de datos
                        .Limit(pagination.PageSize)
                        .ToListAsync();
            }
            //aqui almacenamos el numero de resgistros/records de la base de datos
            long totalDocuments = await _collection.CountDocumentsAsync(FilterDefinition<TDocument>.Empty);
            //aqui guardamos el número de páginas con el décimal menor. El cuál convertimos a entero con Convert.ToInt32
            var totalPages = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(totalDocuments / pagination.PageSize)));

            pagination.Pagequantity = totalPages;
            return pagination;
        }

        public async Task<PaginationEntity<TDocument>> PaginationByFilter(PaginationEntity<TDocument> pagination)
        {
            var sort = Builders<TDocument>.Sort.Ascending(pagination.Sort);
            if (pagination.SortDirection == "desc")
            {
                sort = Builders<TDocument>.Sort.Descending(pagination.Sort);
            }
            var totalDocuments = 0;
            if (pagination.FilterValue == null)
            {
                pagination.Data = await _collection.Find(p => true) //con p=> true indicamos que muestre todos los datos
                        .Sort(sort)
                        //skip permite fijar una posición en la lista de records que devuelve la base de datos y tomar los siguientes elementos
                        .Skip((pagination.Page - 1) * (pagination.PageSize))
                        //limit indica el número de elementos que deve devolver la base de datos
                        .Limit(pagination.PageSize)
                        .ToListAsync();
                //guardamos el valor de todos los records que va a devolver
                totalDocuments = (await _collection.Find(p => true).ToListAsync()).Count();
            }
            else
            {
                //expresion regular que permite buscar los valores que coincidan con el filtro pasado
                var valueFilter = ".*" + pagination.FilterValue.Valor + ".*";

                var filter = Builders<TDocument>.Filter.Regex(pagination.FilterValue.Propiedad, new BsonRegularExpression(valueFilter, "i"));
                pagination.Data = await _collection.Find(filter) //aqui indicamos que muestre los datos que sigan el filterExpresion
                        .Sort(sort)
                        //skip permite fijar una posición en la lista de records que devuelve la base de datos y tomar los siguientes elementos
                        .Skip((pagination.Page - 1) * (pagination.PageSize))
                        //limit indica el número de elementos que deve devolver la base de datos
                        .Limit(pagination.PageSize)
                        .ToListAsync();
                //guardamos el valor de todos los records que va a devolver

                totalDocuments = (await _collection.Find(filter).ToListAsync()).Count();

            }
            var rounded = Math.Ceiling(totalDocuments / Convert.ToDecimal(pagination.PageSize));
            //aqui guardamos el número de páginas con el décimal menor. El cuál convertimos a entero con Convert.ToInt32
            var totalPages = Convert.ToInt32(rounded);
            //cantidad de paginas que hay
            pagination.Pagequantity = totalPages;
            //esta variable guarda la cantidad de records por la consulta cuya cantidad esta determinada por el filtro
            pagination.TotalRows = Convert.ToInt32(totalDocuments);

            return pagination;
        }


    }
}
