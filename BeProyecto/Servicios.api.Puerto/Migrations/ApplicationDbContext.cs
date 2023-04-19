using Microsoft.EntityFrameworkCore;
using Servicios.api.Puerto.Core.Entities;

namespace Servicios.api.Puerto.Migrations
{
    public class ApplicationDbContext :DbContext
    {
        public DbSet<ItemEntity> Item { get; set; }
        public DbSet<UbicacionEntity> Ubicacion { get; set; }
        public DbSet<MantenimientoEntity> Mantenimiento { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {
            
        }


    }
}
