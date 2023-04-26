namespace Servicios.api.Seguridad.Core.JwtLogic
{
    public interface IUsuarioSesion
    {
        //este método devuelve el usuario que esta en sesion
        string GetUsuarioSesion();
    }
}
