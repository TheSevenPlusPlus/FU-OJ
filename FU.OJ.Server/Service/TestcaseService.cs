﻿using FU.OJ.Server.DTOs.Testcase.Request;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

namespace FU.OJ.Server.Service
{
    public interface ITestcaseService
    {
        Task<string> CreateAsync(CreateTestcaseRequest request);
        Task<TestCase?> GetByIdAsync(string id);
        Task UpdateAsync(CreateTestcaseRequest request);
        Task DeleteAsync(string problemCode);
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

        public async Task<TestCase?> GetByIdAsync(string id)
        {
            var testcase = await _context.TestCases.AsNoTracking()
                .FirstOrDefaultAsync(tc => tc.Id == id); // Use Id instead of id

            return testcase;
        }

        public async Task<TestCase?> GetByProblemIdAsync(string problemId)
        {
            return await _context.TestCases.AsNoTracking()
                .FirstOrDefaultAsync(tc => tc.ProblemId == problemId); // Use ProblemId instead of problem_id
        }

        public async Task<string> CreateAsync(CreateTestcaseRequest request)
        {
            var problem = await _problemService.GetByCodeAsync(request.ProblemCode); // Use ProblemCode instead of problem_code
            if (problem == null)
                throw new Exception("Problem not found");

            var existingTestCase = await _context.TestCases.FirstOrDefaultAsync(tc => tc.ProblemId == problem.Id); // Use Id instead of id
            if (existingTestCase != null)
                throw new Exception("Test case already exists for this problem.");

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

            var newTestCase = new TestCase
            {
                ProblemId = problem.Id, // Use ProblemId instead of problem_id
                FolderPath = finalFolderPath // Use FolderPath instead of folder_path
            };

            _context.TestCases.Add(newTestCase);
            problem.TestCaseId = newTestCase.Id; // Use TestCaseId instead of test_case_id
            problem.totalTests = testCaseCount;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();

            // Return test case ID and the number of test cases added
            return newTestCase.Id;
        }


        public async Task UpdateAsync(CreateTestcaseRequest request)
        {
            var problem = await _problemService.GetByCodeAsync(request.ProblemCode);
            if (problem == null)
                throw new Exception("Problem not found");

            var testcase = await _context.TestCases.FirstOrDefaultAsync(tc => tc.ProblemId == problem.Id);
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

            testcase.FolderPath = finalFolderPath; // Use FolderPath instead of folder_path
            _context.TestCases.Update(testcase);
            await _context.SaveChangesAsync();
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

        public async Task DeleteAsync(string problemCode)
        {
            var problem = await _context.Problems.AsNoTracking().FirstOrDefaultAsync(u => u.Code == problemCode); // Use Code instead of code
            if (problem == null)
                throw new Exception(ErrorMessage.NotFound);

            var testcase = await _context.TestCases.AsNoTracking().FirstOrDefaultAsync(u => u.ProblemId == problem.Id); // Use ProblemId instead of problem_id
            if (testcase == null)
                throw new Exception("Test case not found");

            if (Directory.Exists(testcase.FolderPath)) // Use FolderPath instead of folder_path
            {
                DeleteDirectoryRecursively(testcase.FolderPath);
            }

            _context.TestCases.Remove(testcase);
            await _context.SaveChangesAsync();
        }
    }
}
