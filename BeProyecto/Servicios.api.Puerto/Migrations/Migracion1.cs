using MongoDB.Driver;
using MongoDBMigrations;

namespace Servicios.api.Puerto.Migrations
{
    public class Migracion1 : IMigration
    {
        public MongoDBMigrations.Version Version => new MongoDBMigrations.Version(1,1,0);

        public string Name => "Primera migracion";

        public void Down(IMongoDatabase database)
        {
            throw new NotImplementedException();
        }

        public void Up(IMongoDatabase database)
        {
            throw new NotImplementedException();
        }
    }
}
