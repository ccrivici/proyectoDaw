using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Servicios.api.Seguridad.Core.Dto;
using Servicios.api.Seguridad.Core.Entities;
using Servicios.api.Seguridad.Core.JwtLogic;
using Servicios.api.Seguridad.Core.Persistence;
using static Servicios.api.Seguridad.Core.Application.Login;

namespace Servicios.api.Seguridad.Core.Application
{
    public class Login
    {
          public class UsuarioLoginCommand : IRequest<UsuarioDto>
        {
            public string Email { get; set; }
            public string Password { get; set; }

        }
        //clase de validación
        public class UsuarioLoginValidation: AbstractValidator<UsuarioLoginCommand>
        {
            public UsuarioLoginValidation() {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }
    }
    //clase de reglas de negocio
    public class UsuarioLoginHandler : IRequestHandler<UsuarioLoginCommand, UsuarioDto>
    {
        //inyectamos los objetos necesarios para ahcer la transaccion en la bbdd
        private readonly SeguridadContexto _context;
        private readonly UserManager<Usuario> _userManager;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly SignInManager<Usuario> _signInManager;

        public UsuarioLoginHandler(SeguridadContexto context, UserManager<Usuario> userManager, IMapper mapper, IJwtGenerator jwtGenerator, SignInManager<Usuario> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _jwtGenerator = jwtGenerator;
            //se encarga de hacer el login
            _signInManager = signInManager;
        }

        public async Task<UsuarioDto> Handle(UsuarioLoginCommand request, CancellationToken cancellationToken)
        {
            var usuario = await _userManager.FindByEmailAsync(request.Email);
            if (usuario == null)
            {
                throw new Exception("El usuario no existe");
            }  //comproabmos la contraseña y si falla no bloquea al usuario
                var resultado = await  _signInManager.CheckPasswordSignInAsync(usuario, request.Password,false);

            if (resultado.Succeeded)
            {
                //tenemos que devolver un usuarioDto por eso lo mapeamos
                var usuarioDto = _mapper.Map<Usuario, UsuarioDto>(usuario);
                //creamos el token 
                usuarioDto.Token = _jwtGenerator.CreateToken(usuario);
                return usuarioDto;
            }
            throw new Exception("Login incorrecto");
        }
    }
}
