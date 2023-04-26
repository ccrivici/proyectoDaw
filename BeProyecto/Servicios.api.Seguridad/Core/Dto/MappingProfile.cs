using AutoMapper;
using Servicios.api.Seguridad.Core.Entities;

namespace Servicios.api.Seguridad.Core.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //tiene 2 parámetros la clase inicial y la clase final
            CreateMap<Usuario, UsuarioDto>();
        }
    }
}
