using Servicios.api.Puerto.Core;
using Servicios.api.Puerto.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MongoSettings>(options =>
{
    options.ConnectionString = builder.Configuration.GetSection("MongoDb:ConnectionString").Value;
    options.Database = builder.Configuration.GetSection("MongoDb:Database").Value;

}
);

builder.Services.AddSingleton<MongoSettings>();
builder.Services.AddScoped(typeof(IMongoRepository<>), typeof(MongoRepository<>));
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsRule", rule => {
        rule.AllowAnyHeader().AllowAnyMethod().WithOrigins("*");
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();
app.UseCors("CorsRule");
app.MapControllers();

app.Run();
