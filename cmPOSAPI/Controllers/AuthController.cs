using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using cmPOSAPI.Database;
using cmPOSAPI.Models;
using CryptoHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace cmposapi.Controller
{
    [ApiController]
    [Route("api/v2/[controller]")]
    public class AuthController : ControllerBase
    {

        ILogger<AuthController> _logger;
        public DatabaseContext Context { get; }
        public IConfiguration Configuration { get; }

        public AuthController(ILogger<AuthController> logger, DatabaseContext context, IConfiguration Configuration)
        {
            _logger = logger;
            Context = context;
            this.Configuration = Configuration;
        }

        //FromForm = data
        //FromBody = json

        [HttpPost("register")]
        public IActionResult Register([FromBody] Users model)
        {
            try
            {
                model.Password = Crypto.HashPassword(model.Password);

                Context.Users.Add(model);
                Context.SaveChanges();
                //return Created("", null);//201
                return Ok(new { result = "ok", message = "register successfully" });

            }
            catch (Exception)
            {
                _logger.LogError("Failed to execute POST");
                return BadRequest();
            }
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] Users model)
        {
            try
            {
                var result = Context.Users.SingleOrDefault(u => u.Username == model.Username);
                if (result == null)
                    return NotFound();
                if (!Crypto.VerifyHashedPassword(result.Password, model.Password))
                    return Unauthorized();

                //set jwt 
                var token = BuildToken(result);
                return Ok(new { token = token, message = "login successfully" });

            }
            catch (Exception ex)
            {

                _logger.LogError("Failed to execute POST");
                return BadRequest();
            }
        }
        private string BuildToken(Users user)
        {
            // key is case-sensitive
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, Configuration["Jwt:Subject"]),
                new Claim("id", user.Id.ToString()),
                new Claim("username", user.Username),
                new Claim("position", user.Position),
            //ใช้ role เพื่อลดการโหลดดาต้าเบส
                new Claim(ClaimTypes.Role, user.Position)
            };
            var expires = DateTime.Now.AddDays(Convert.ToDouble(Configuration["Jwt:ExpireDay"]));
            //แก้วันที่ได้
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: Configuration["Jwt:Issuer"],
                audience: Configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}