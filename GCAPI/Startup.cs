using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GCAPI.Startup))]
namespace GCAPI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
