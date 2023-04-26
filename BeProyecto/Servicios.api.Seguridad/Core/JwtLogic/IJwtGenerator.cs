using Servicios.api.Seguridad.Core.Entities;

namespace Servicios.api.Seguridad.Core.JwtLogic
{
    public interface IJwtGenerator
    {
        string CreateToken(Usuario usuario);

    }
}
