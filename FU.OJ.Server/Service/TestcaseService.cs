using FU.OJ.Server.DTOs.Testcase.Request;using FU.OJ.Server.Infra.Context;using Microsoft.EntityFrameworkCore;using System.IO.Compression;

namespace FU.OJ.Server.Service{    public interface ITestcaseService
    {
        Task<string> CreateAsync(string userId, CreateTestcaseRequest request);
        Task<string?> UpdateAsync(CreateTestcaseRequest request);
        Task<bool> DeleteAsync(string userId, string problemId);
    }
    public class TestcaseService : ITestcaseService
    {
        private readonly ApplicationDbContext _context;
        private readonly IProblemService _problemService;
        private readonly string _testcaseDirectory = "Testcase"; // Directory path for test cases

        public TestcaseService(ApplicationDbContext context, IProblemService problemService)
        {
            _context = context;
            _problemService = problemService;
        }
        public async Task<string> CreateAsync(string userId, CreateTestcaseRequest request)
        {
            var problem = await _context.Problems.AsNoTracking().FirstOrDefaultAsync(p => p.Code == request.ProblemCode);
            if (problem == null)
                throw new Exception("This problem " + request.ProblemCode + " not found");
            // Handle ZIP file
            var zipFolderName = Path.GetFileNameWithoutExtension(request.TestcaseFile.FileName); // Use TestcaseFile instead of testcase_file
            var tempFolderPath = Path.Combine("TempDirectory");

            DeleteDirectoryRecursively(tempFolderPath);
            Directory.CreateDirectory(tempFolderPath);
            var fileExtension = Path.GetExtension(request.TestcaseFile.FileName);
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
                await request.TestcaseFile.CopyToAsync(stream);
            }
            // Extract the zip file to the temporary folder
            ZipFile.ExtractToDirectory(tempZipPath, tempFolderPath);
            File.Delete(tempZipPath);
            // After extracting zip file to tempFolderPath
            var finalFolderPath = Path.Combine(_testcaseDirectory, problem.Code); // Use Code instead of code
            // Delete old directory if exists
            if (Directory.Exists(finalFolderPath))
            {
                DeleteDirectoryRecursively(finalFolderPath);
            }
            // Create new directory for test cases
            Directory.CreateDirectory(finalFolderPath);
            // Initialize a counter for test cases
            int testCaseCount = 0;
            // Move sub-testcase directories to finalFolderPath and count them
            foreach (var dir in Directory.GetDirectories(Path.Combine(tempFolderPath, zipFolderName)))
            {
                var dirName = Path.GetFileName(dir);
                var targetDir = Path.Combine(finalFolderPath, dirName);
                Directory.Move(dir, targetDir);
                // Increment test case count
                testCaseCount++;
            }
            // Delete temporary folder
            DeleteDirectoryRecursively(tempFolderPath);
            problem.TotalTests = testCaseCount;
            problem.TestCasePath = finalFolderPath;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();
            return "Success";
        }

        public async Task<string?> UpdateAsync(CreateTestcaseRequest request)
        {
            var problem = await _context.Problems.AsNoTracking().FirstOrDefaultAsync(p => p.Code == request.ProblemCode);
            if (problem == null)
                throw new Exception("Problem not found");
            var testcase = problem.TestCasePath;
            if (testcase == null)
                throw new Exception("Test case not found");
            // Handle ZIP file
            var zipFolderName = Path.GetFileNameWithoutExtension(request.TestcaseFile.FileName);
            var tempFolderPath = Path.Combine("TempDirectory");
            DeleteDirectoryRecursively(tempFolderPath);
            Directory.CreateDirectory(tempFolderPath);
            var fileExtension = Path.GetExtension(request.TestcaseFile.FileName);
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
                await request.TestcaseFile.CopyToAsync(stream);
            }
            // Extract the zip file to the temporary folder
            ZipFile.ExtractToDirectory(tempZipPath, tempFolderPath);
            File.Delete(tempZipPath);
            // After extracting zip file to tempFolderPath
            var finalFolderPath = Path.Combine(_testcaseDirectory, problem.Code);
            // Delete old directory if exists
            if (Directory.Exists(finalFolderPath))
            {
                DeleteDirectoryRecursively(finalFolderPath);
            }
            // Create new directory for test cases
            Directory.CreateDirectory(finalFolderPath);
            // Move sub-testcase directories to finalFolderPath
            foreach (var dir in Directory.GetDirectories(Path.Combine(tempFolderPath, zipFolderName)))
            {
                var dirName = Path.GetFileName(dir);
                var targetDir = Path.Combine(finalFolderPath, dirName);
                Directory.Move(dir, targetDir);
            }
            // Delete temporary folder
            DeleteDirectoryRecursively(tempFolderPath);
            problem.TestCasePath = finalFolderPath; // Use FolderPath instead of folder_path
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();
            return "Updated successful";
        }
        private void DeleteDirectoryRecursively(string path)
        {
            if (Directory.Exists(path))
            {
                // Delete all files in the directory
                foreach (var file in Directory.GetFiles(path))
                {
                    File.Delete(file);
                }
                // Delete all subdirectories
                foreach (var directory in Directory.GetDirectories(path))
                {
                    DeleteDirectoryRecursively(directory);
                }
                // Delete the current directory
                Directory.Delete(path);
            }
        }
        public async Task<bool> DeleteAsync(string userId, string problemId)
        {
            var problem = await _context.Problems.AsNoTracking().FirstOrDefaultAsync(u => u.Id == problemId && u.UserId == userId);
            if (problem == null)
                return false;
            if (Directory.Exists(problem.TestCasePath))
            {
                DeleteDirectoryRecursively(problem.TestCasePath);
            }
            problem.TestCasePath = null;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}