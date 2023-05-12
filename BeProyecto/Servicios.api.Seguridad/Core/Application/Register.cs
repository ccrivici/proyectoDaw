using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Servicios.api.Seguridad.Core.Dto;
/*using Servicios.api.Seguridad.Core.Dto;
using Servicios.api.Seguridad.Core.JwtLogic;*/
using Servicios.api.Seguridad.Core.Entities;
using Servicios.api.Seguridad.Core.JwtLogic;
using Servicios.api.Seguridad.Core.Persistence;

namespace Servicios.api.Seguridad.Core.Application
{
    public class Register
    {
        public class UsuarioRegisterCommand : IRequest<UsuarioDto>
        {
            public string Nombre { get; set; }
            public string Apellido { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

        }
        //esta clase controla que se respeten las reglas de validacion
        public class UsuarioRegisterValidation : AbstractValidator<UsuarioRegisterCommand>
        {
            public UsuarioRegisterValidation()
            {
                RuleFor(x => x.Nombre).NotEmpty();
                RuleFor(x => x.Apellido).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();

            }
        }
        //esta clase se encarga de procesar la lógica de negocio ,los datos del usuarioa a gregar sale de
        //UsuarioRegisterCommand y devuelve un UsuarioDto
        public class UsuarioRegisterHandler : IRequestHandler<UsuarioRegisterCommand, UsuarioDto>
        {
            private readonly SeguridadContexto _context;
            private readonly UserManager<Usuario> _userManager;
            private readonly IMapper _mapper;
            private readonly IJwtGenerator _jwtGenerator;

            public UsuarioRegisterHandler(SeguridadContexto context, UserManager<Usuario> userManager, IMapper mapper, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _mapper = mapper;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<UsuarioDto> Handle(UsuarioRegisterCommand request, CancellationToken cancellationToken)
            {
                //validamos si ya existe ese email registrado
                var existe = await _context.Users.Where(x => x.Email == request.Email).AnyAsync();
                if (existe)
                {
                    throw new Exception("El email del usuario ya existe");
                }
                //validamos si ya existe ese UserName
                existe = await _context.Users.Where(x => x.UserName == request.UserName).AnyAsync();
                if (existe)
                {
                    throw new Exception("El username ya existe");
                }
                //creamos el usuario
                var usuario = new Usuario
                {
                    Nombre = request.Nombre,
                    Apellido = request.Apellido,
                    Email = request.Email,
                    UserName = request.UserName,
                };
                //lo insertamos el la bbdd
                var resultado = await _userManager.CreateAsync(usuario, request.Password);
                if (resultado.Succeeded)
                {
                    var usuarioDTO = _mapper.Map<Usuario, UsuarioDto>(usuario);
                    usuarioDTO.Token = _jwtGenerator.CreateToken(usuario);
                    return usuarioDTO;
                }
                throw new Exception("No se pudo registrar el usuario");
            }
        }

    }
}
