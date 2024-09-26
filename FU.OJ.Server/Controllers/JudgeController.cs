using FU.OJ.Server.Infra.Const.Route;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [Route(JudgeRoute.INDEX)]
    [ApiController]
    //[Authorize]
    public class JudgeController : BaseController
    {
        private readonly string JudgeServerUrl = "";
        private readonly HttpClient _httpClient;

        public JudgeController(HttpClient httpClient, IConfiguration configuration, ILogger<JudgeController> logger) : base(logger)
        {
            _httpClient = httpClient;
            JudgeServerUrl = configuration.GetValue<string>("JudgeServerUrl")!;
        }

        [HttpGet(JudgeRoute.Action.GetAll)]
        public async Task<IActionResult> GetLanguages()
        {
            string url = $"{JudgeServerUrl}/languages/all";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        [HttpGet(JudgeRoute.Action.GetDetail)]
        public async Task<IActionResult> GetLanguageById([FromRoute] int id)
        {
            string url = $"{JudgeServerUrl}/languages/{id}";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        [HttpGet(JudgeRoute.Action.GetStatus)]
        public async Task<IActionResult> GetStatus()
        {
            string url = $"{JudgeServerUrl}/statuses";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        [HttpGet(JudgeRoute.Action.GetActive)]
        public async Task<IActionResult> GetActiveLanguages()
        {
            string url = $"{JudgeServerUrl}/languages/all";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        // API to get system info
        [HttpGet(JudgeRoute.Action.SystemInfo)]
        public async Task<IActionResult> GetSystemInfo()
        {
            string url = $"{JudgeServerUrl}/system_info";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        // API to get configuration info
        [HttpGet(JudgeRoute.Action.ConfigInfo)]
        public async Task<IActionResult> GetConfigInfo()
        {
            string url = $"{JudgeServerUrl}/config_info";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        // API to get statistics
        [HttpGet(JudgeRoute.Action.Statistics)]
        public async Task<IActionResult> GetStatistics([FromQuery] bool invalidateCache = false)
        {
            string url = $"{JudgeServerUrl}/statistics?invalidate_cache={invalidateCache.ToString().ToLower()}";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }

        // API to get workers info
        [HttpGet(JudgeRoute.Action.Workers)]
        public async Task<IActionResult> GetWorkers()
        {
            string url = $"{JudgeServerUrl}/workers";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
    }
}