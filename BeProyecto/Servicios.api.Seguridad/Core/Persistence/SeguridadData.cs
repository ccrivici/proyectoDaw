using Microsoft.AspNetCore.Identity;
using Servicios.api.Seguridad.Core.Entities;


namespace Servicios.api.Seguridad.Core.Persistence
{
    public class SeguridadData
    {
        //recibe 2 parámetros el contexto de la bbdd y el user manager que administra los datos de usuarios almacenados en la bbdd
        public static async Task InsertarUsuario(SeguridadContexto context, UserManager<Usuario> usuarioManager)
        {
            //este if controla si existe algún usuario creado
            if (!usuarioManager.Users.Any())
            {
                var usuario = new Usuario
                {
                    Nombre = "Carlos",
                    Apellido = "crivi",
                    UserName = "carlosCrivi",
                    Email = "carloscrivi@gmail.com"
                };
                await usuarioManager.CreateAsync(usuario, "Password123$");
            }
        }
    }
}
