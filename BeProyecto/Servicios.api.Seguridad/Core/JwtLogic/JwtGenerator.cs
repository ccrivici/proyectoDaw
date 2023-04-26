using Microsoft.IdentityModel.Tokens;
using Servicios.api.Seguridad.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Servicios.api.Seguridad.Core.JwtLogic
{
    public class JwtGenerator : IJwtGenerator
    {
        public string CreateToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                //el valor key del claim
                new Claim("username",usuario.UserName),
                new Claim("nombre",usuario.Nombre),
                new Claim("apellido",usuario.Apellido),
            };
            //variable que desencripta el token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("mqAaByVDD5Angegb66uIaCW5JSXeiNC0"));

            // protocolo de desencriptacion: le pasamos como argumento la key y el algoritmo de desencriptacion
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            //procedemos a crear el token
            var tokenDescription = new SecurityTokenDescriptor
            {   //son los valores que va a tener el token
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(3),
                SigningCredentials = credential,
            };
            //creamos el token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescription);
            //lo devolvemos como string
            return tokenHandler.WriteToken(token);
        }
    }
}