using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Configuration.AddJsonFile($"ocelot.json");

//builder.Services.AddControllers();
builder.Services.AddOcelot();
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
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsRule", rule => {
        rule.AllowAnyHeader().AllowAnyMethod().WithOrigins("*");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("CorsRule");
app.UseHttpsRedirection();

app.UseAuthorization();
await app.UseOcelot();
app.MapControllers();

app.Run();
