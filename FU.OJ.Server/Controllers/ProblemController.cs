using FU.OJ.Server.Infra.Models;
using FU.OJ.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProblemController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/problem
        [HttpGet]
        public IActionResult GetAllProblems()
        {
            var problems = _unitOfWork.ProblemRepository.GetAll();
            return Ok(problems);
        }

        // GET: api/problem/{id}
        [HttpGet("{id:guid}")]
        public IActionResult GetProblemById(string id)
        {
            var problem = _unitOfWork.ProblemRepository.Get(p => p.id == id);
            if (problem == null)
                return NotFound();

            return Ok(problem);
        }

        // POST: api/problem
        [HttpPost]
        public IActionResult CreateProblem([FromBody] Problem problem)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _unitOfWork.ProblemRepository.Add(problem);
            _unitOfWork.Save();

            return CreatedAtAction(nameof(GetProblemById), new { id = problem.id }, problem);
        }

        // PUT: api/problem/{id}
        [HttpPut("{id:guid}")]
        public IActionResult UpdateProblem(string id, [FromBody] Problem problem)
        {
            if (id != problem.id || !ModelState.IsValid)
                return BadRequest();

            _unitOfWork.ProblemRepository.Update(problem);
            _unitOfWork.Save();

            return NoContent();
        }

        // DELETE: api/problem/{id}
        [HttpDelete("{id:guid}")]
        public IActionResult DeleteProblem(string id)
        {
            var problem = _unitOfWork.ProblemRepository.Get(p => p.id == id);
            if (problem == null)
                return NotFound();

            _unitOfWork.ProblemRepository.Remove(problem);
            _unitOfWork.Save();

            return NoContent();
        }
    }
}