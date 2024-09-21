using FU.OJ.Server.DTOs.Testcase.Request;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

namespace FU.OJ.Server.Service
{
    public interface ITestcaseService
    {
        Task<string> createAsync(CreateTestcaseRequest request);
        public Task<TestCase?> getByIdAsync(string id);
        Task updateAsync(CreateTestcaseRequest request);
        Task deleteAsync(string id);
    }

    public class TestcaseService : ITestcaseService
    {
        private readonly ApplicationDBContext _context;
        private readonly IProblemService _problemService;
        private readonly string _testcaseDirectory = "Testcase"; // Đường dẫn folder chứa test case

        public TestcaseService(ApplicationDBContext context, IProblemService problemService)
        {
            _context = context;
            _problemService = problemService;
        }

        public async Task<TestCase?> getByIdAsync(string id)
        {
            var testcase = await _context.TestCases.AsNoTracking()
                .FirstOrDefaultAsync(p => p.id == id);

            return testcase;
        }

        public async Task<TestCase?> getByProblemIdAsync(string problem_id)
        {
            return await _context.TestCases.AsNoTracking()
                .FirstOrDefaultAsync(p => p.problem_id == problem_id);
        }
        public async Task<string> createAsync(CreateTestcaseRequest request)
        {
            var problem = await _problemService.getByIdAsync(request.problem_id);
            if (problem == null)
                throw new Exception("Problem not found");

            var existingTestCase = await _context.TestCases.FirstOrDefaultAsync(tc => tc.problem_id == request.problem_id);
            if (existingTestCase != null)
                throw new Exception("Test case already exists for this problem.");

            //Xu li ZIP
            var zipFolderName = Path.GetFileNameWithoutExtension(request.testcase_file.FileName);
            var tempFolderPath = Path.Combine("TempDirectory");
            DeleteDirectoryRecursively(tempFolderPath);
            Directory.CreateDirectory(tempFolderPath);

            var fileExtension = Path.GetExtension(request.testcase_file.FileName);
            if (fileExtension != ".zip")
            {
                throw new Exception("Only .zip files are supported.");
            }

            var tempZipPath = Path.Combine("TempZipDirectory", zipFolderName);
            if (!Directory.Exists("TempZipDirectory"))
            {
                Directory.CreateDirectory("TempZipDirectory");
            }


            using (var stream = new FileStream(tempZipPath, FileMode.Create))
            {
                await request.testcase_file.CopyToAsync(stream);
            }

            // Extract the zip file to the temporary folder
            ZipFile.ExtractToDirectory(tempZipPath, tempFolderPath);
            File.Delete(tempZipPath);

            // Sau khi giải nén zip file vào tempFolderPath
            var finalFolderPath = Path.Combine(_testcaseDirectory, problem.code);

            // Xóa thư mục cũ nếu có
            if (Directory.Exists(finalFolderPath))
            {
                DeleteDirectoryRecursively(finalFolderPath);
            }

            // Tạo thư mục mới cho các testcase
            Directory.CreateDirectory(finalFolderPath);

            // Di chuyển các thư mục testcase con vào finalFolderPath
            foreach (var dir in Directory.GetDirectories(Path.Combine(tempFolderPath, zipFolderName)))
            {
                var dirName = Path.GetFileName(dir);
                var targetDir = Path.Combine(finalFolderPath, dirName);
                Directory.Move(dir, targetDir);
            }

            // Xóa thư mục tạm thời
            DeleteDirectoryRecursively(tempFolderPath);

            var newTestCase = new TestCase
            {
                problem_id = request.problem_id,
                folder_path = finalFolderPath
            };

            _context.TestCases.Add(newTestCase);
            problem.test_case_id = newTestCase.id;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();

            return newTestCase.id;
        }

        public async Task updateAsync(CreateTestcaseRequest request)
        {
            var testcase = await _context.TestCases.FirstOrDefaultAsync(tc => tc.problem_id == request.problem_id);
            if (testcase == null)
                throw new Exception("Test case not found");

            var problem = await _problemService.getByIdAsync(request.problem_id);
            if (problem == null)
                throw new Exception("Problem not found");

            //Xu li ZIP
            var zipFolderName = Path.GetFileNameWithoutExtension(request.testcase_file.FileName);
            var tempFolderPath = Path.Combine("TempDirectory");
            DeleteDirectoryRecursively(tempFolderPath);
            Directory.CreateDirectory(tempFolderPath);

            var fileExtension = Path.GetExtension(request.testcase_file.FileName);
            if (fileExtension != ".zip")
            {
                throw new Exception("Only .zip files are supported.");
            }

            var tempZipPath = Path.Combine("TempZipDirectory", zipFolderName);
            if (!Directory.Exists("TempZipDirectory"))
            {
                Directory.CreateDirectory("TempZipDirectory");
            }


            using (var stream = new FileStream(tempZipPath, FileMode.Create))
            {
                await request.testcase_file.CopyToAsync(stream);
            }

            // Extract the zip file to the temporary folder
            ZipFile.ExtractToDirectory(tempZipPath, tempFolderPath);
            File.Delete(tempZipPath);

            // Sau khi giải nén zip file vào tempFolderPath
            var finalFolderPath = Path.Combine(_testcaseDirectory, problem.code);

            // Xóa thư mục cũ nếu có
            if (Directory.Exists(finalFolderPath))
            {
                DeleteDirectoryRecursively(finalFolderPath);
            }

            // Tạo thư mục mới cho các testcase
            Directory.CreateDirectory(finalFolderPath);

            // Di chuyển các thư mục testcase con vào finalFolderPath
            foreach (var dir in Directory.GetDirectories(Path.Combine(tempFolderPath, zipFolderName)))
            {
                var dirName = Path.GetFileName(dir);
                var targetDir = Path.Combine(finalFolderPath, dirName);
                Directory.Move(dir, targetDir);
            }

            // Xóa thư mục tạm thời
            DeleteDirectoryRecursively(tempFolderPath);

            testcase.folder_path = finalFolderPath;
            _context.TestCases.Update(testcase);
            await _context.SaveChangesAsync();
        }

        private void DeleteDirectoryRecursively(string path)
        {
            if (Directory.Exists(path))
            {
                // Xóa tất cả các tập tin trong thư mục
                foreach (var file in Directory.GetFiles(path))
                {
                    File.Delete(file);
                }

                // Xóa tất cả các thư mục con
                foreach (var directory in Directory.GetDirectories(path))
                {
                    DeleteDirectoryRecursively(directory);
                }

                // Xóa thư mục hiện tại
                Directory.Delete(path);
            }
        }



        public async Task deleteAsync(string id)
        {
            var testcase = await _context.TestCases.FindAsync(id);
            if (testcase == null)
                throw new Exception("Test case not found");

            if (Directory.Exists(testcase.folder_path))
            {
                Directory.Delete(testcase.folder_path, true);
            }

            _context.TestCases.Remove(testcase);
            await _context.SaveChangesAsync();
        }
    }
}
