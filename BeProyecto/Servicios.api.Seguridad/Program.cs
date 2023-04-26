using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Servicios.api.Seguridad.Core.Application;
using Servicios.api.Seguridad.Core.Entities;
using Servicios.api.Seguridad.Core.JwtLogic;
using Servicios.api.Seguridad.Core.Persistence;
using System.Text;
using System.Timers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


//añadimos la referencia indicando la clase que va a contenerla para usar el AddFluentValidation
builder.Services.AddControllers().AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<Register>());

builder.Services.AddDbContext<SeguridadContexto>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("conexionDB")));
/**
 * el core identity se encarga de la seguridad
 * entityFrameworkCore se encarga de hacer el vinculo entre la persistencia de c# y la bbdd sql server
 * Para hacer que se comuniquen usamos la instancia de core Identity vul y usamos identityBuilder para juntas ambas herramientas
 */
//agrega los métodos para crear usuarios usando controllers y workflow de datos dentro del proyecto Seguridad
var bul = builder.Services.AddIdentityCore<Usuario>();

var identityBuilder = new IdentityBuilder(bul.UserType, builder.Services);
//entity framework core mapea los datos y los inserta en la bbdd
identityBuilder.AddEntityFrameworkStores<SeguridadContexto>();
//permite hacer login usando el objeto SignInManager
identityBuilder.AddSignInManager<SignInManager<Usuario>>();
//para controlar la fecha y hora de crear usuarios
builder.Services.TryAddSingleton<ISystemClock, SystemClock>();

//instanciamos el objeto Mapper para poder inyectarlo
builder.Services.AddAutoMapper(typeof(Register.UsuarioRegisterHandler));

builder.Services.AddScoped<IJwtGenerator, JwtGenerator>();
builder.Services.AddScoped<IUsuarioSesion, UsuarioSesion>();

//key usada para descodificar los tokens
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("mqAaByVDD5Angegb66uIaCW5JSXeiNC0"));
//el token tiene que estar firmado con la clave que hemos generado
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        //aqui configuramos si cualquiera puede acceder al token
        ValidateAudience = false,
        //verifica desde que dominio se genera el token
        ValidateIssuer = false,
    };
});


//instanciamos el objeto MediatR para poder inyectarlo
builder.Services.AddMediatR(typeof(Register.UsuarioRegisterCommand).Assembly);
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsRule", rule => {
        rule.AllowAnyHeader().AllowAnyMethod().WithOrigins("*");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
