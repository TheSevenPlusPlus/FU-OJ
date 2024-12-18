using FU.OJ.Server.Infra.Const.Route;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers{    [Route(JudgeRoute.INDEX)]
    [ApiController]
    [Authorize]
    public class JudgeController : AuthorizeController
    {
        private readonly string _judgeServerUrl;
        private readonly HttpClient _httpClient;
        public JudgeController(HttpClient httpClient, IConfiguration configuration, ILogger<JudgeController> logger) : base(logger)
        {
            _httpClient = httpClient;
            _judgeServerUrl = configuration.GetValue<string>("JudgeServerUrl")!;
        }
        [HttpGet(JudgeRoute.Action.GetAll)]
        public async Task<IActionResult> GetLanguagesAsync()
        {
            var url = $"{_judgeServerUrl}/languages/all";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.GetDetail)]
        public async Task<IActionResult> GetLanguageByIdAsync([FromRoute] int id)
        {
            var url = $"{_judgeServerUrl}/languages/{id}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.GetStatus)]
        public async Task<IActionResult> GetStatusAsync()
        {
            var url = $"{_judgeServerUrl}/statuses";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.GetActive)]
        public async Task<IActionResult> GetActiveLanguagesAsync()
        {
            var url = $"{_judgeServerUrl}/languages/all";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.SystemInfo)]
        public async Task<IActionResult> GetSystemInfoAsync()
        {
            var url = $"{_judgeServerUrl}/system_info";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.ConfigInfo)]
        public async Task<IActionResult> GetConfigInfoAsync()
        {
            var url = $"{_judgeServerUrl}/config_info";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.Statistics)]
        public async Task<IActionResult> GetStatisticsAsync([FromQuery] bool invalidateCache = false)
        {
            var url = $"{_judgeServerUrl}/statistics?invalidate_cache={invalidateCache.ToString().ToLower()}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
        [HttpGet(JudgeRoute.Action.Workers)]
        public async Task<IActionResult> GetWorkersAsync()
        {
            var url = $"{_judgeServerUrl}/workers";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            return StatusCode((int)response.StatusCode);
        }
    }
}