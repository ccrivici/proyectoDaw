using Servicios.api.Puerto.Core.Entities;
using System.Linq.Expressions;

namespace Servicios.api.Puerto.Repository
{
    public interface IMongoRepository<TDocument> where TDocument : IDocument
    {

        Task<IEnumerable<TDocument>> GetAll();
        Task InsertDocument(TDocument document);

        
        Task<TDocument> GetById(string Id);
        Task UpdateDocument(TDocument document);

        Task DeleteById(string Id);


        Task<PaginationEntity<TDocument>> PaginationBy(
            Expression<Func<TDocument, bool>> filterExpression,
            PaginationEntity<TDocument> pagination);

        Task<PaginationEntity<TDocument>> PaginationByFilter(
            PaginationEntity<TDocument> pagination);

    }
}
