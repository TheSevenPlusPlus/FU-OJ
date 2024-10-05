﻿using Exceptions;
using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Contest.Request;
using FU.OJ.Server.DTOs.Contest.Response;
using FU.OJ.Server.DTOs.Submission.Request;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace FU.OJ.Server.Service
{
    public interface IContestService
    {
        public Task<string> CreateContestAsync(string userId, CreateContestRequest request);
        public Task<Contest?> GetContestByCodeAsync(string code);
        public Task<ContestView> GetContestInfoAsync(string contestCode);
        public Task<ContestProblem?> GetContestProblemByCodeAsync(string contestCode, string code);
        public Task<ContestParticipant?> GetContestParticipantByCodeAsync(string contestCode, string userId);
        public Task<ContestParticipantProblem?> GetContestParticipantproblemByCodeAsync(string problemCode, string userId);
        public Task<bool> SubmitCode(string userId, SubmitCodeContestProblemRequest request);
        public Task<bool> RegisterContest(string userId, string contestCode);
        public Task<(List<ContestView> contests,  int totalPages)> GetListContestsAsync(Paging query, string userId, bool? isMine = false);
        public Task<List<ContestProblemView>> GetContestProblemInfoByCodeAsync(string contestCode, string userId);
        public Task<List<ContestParticipantView>> GetContestParticipantInfoByCodeAsync(string contestCode);
        public Task<bool> IsRegistered(string contestCode, string userId);
    }
    public class ContestService : IContestService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        private readonly IProblemService _problemService;
        private readonly ISubmissionService _submissionService;

        public ContestService(ApplicationDbContext context, IUserService userService, IProblemService problemService, ISubmissionService submissionService)
        {
            _context = context;
            _userService = userService;
            _problemService = problemService;
            _submissionService = submissionService;
        }

        public async Task<Contest?> GetContestByCodeAsync(string code)
        {
            var contest = await _context.Contests.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Code == code);

            return contest;
        }

        public async Task<ContestProblem?> GetContestProblemByCodeAsync(string contestCode, string code)
        {
            var contestProblem = await _context.ContestProblems.AsNoTracking()
                .FirstOrDefaultAsync(c => c.ContestCode == contestCode && c.ProblemCode == code);

            return contestProblem;
        }

        public async Task<ContestParticipant?> GetContestParticipantByCodeAsync(string contestCode, string userId)
        {
            var contestPaticipant = await _context.ContestParticipants.AsNoTracking()
                .FirstOrDefaultAsync(c => c.ContestCode == contestCode && c.UserId == userId);

            return contestPaticipant;
        }

        public async Task<ContestParticipantProblem?> GetContestParticipantproblemByCodeAsync(string problemCode, string userId)
        {
            var paticipantProblem = await _context.ContestParticipantProblems.AsNoTracking()
                .FirstOrDefaultAsync(c => c.ContestParticipantId == userId && c.ContestProblemCode == problemCode);

            return paticipantProblem;
        }

        public async Task<string> CreateContestAsync(string userId, CreateContestRequest request)
        {
            var contest = await GetContestByCodeAsync(request.Code);
            if (contest != null)
                throw new BadException(ErrorMessage.ContestCodeExisted);

            if (request.StartTime > request.EndTime)
                throw new BadException(ErrorMessage.StartTimeGreaterThanEndTime);

            var user = await _userService.GetUserByIdAsync(request.OrganizationId);
            if (user == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            var _user = await _userService.GetUserByIdAsync(userId);
            if (_user == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            contest = new Contest
            {
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                OrganizationId = request.OrganizationId,
                OrganizationName = user.UserName ?? "Unknown",
                Rules = request.Rules
            };

            _context.Contests.Add(contest);
            foreach (var contestProblem in request.Problems)
            {
                var problem = await _problemService.GetByCodeAsync(userId, contestProblem.ProblemCode);
                if (problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var contestProblems = new ContestProblem
                {
                    ContestId = contest.Id,
                    ContestCode = contest.Code,
                    ProblemId = problem.Id,
                    ProblemCode = problem.Code,
                    Order = contestProblem.Order,
                    Point = contestProblem.Point
                };

                _context.ContestProblems.Add(contestProblems);
            }

            await _context.SaveChangesAsync();
            return contest.Code;
        }

        public async Task<ContestView> GetContestInfoAsync(string contestCode)
        {
            var contest = await _context.Contests.AsNoTracking()
                .Include(c => c.ContestParticipants)
                .Include(c => c.ContestProblems)
                .FirstOrDefaultAsync(c => c.Code == contestCode);

            if (contest == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            return new ContestView
            {
                Id = contest.Id,
                Code = contest.Code,
                Name = contest.Name,
                Description = contest.Description,
                StartTime = contest.StartTime,
                EndTime = contest.EndTime,
                Rules = contest.Rules,
                OrganizationId = contest.OrganizationId,
                OrganizationName = contest.OrganizationName,
                Participants = contest.ContestParticipants.Select(p => new ContestParticipantView
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Score = p.Score
                }).ToList(),
                Problems = contest.ContestProblems.Select(cp => new ContestProblemView
                {
                    Id = cp.Id,
                    ProblemId = cp.ProblemId,
                    ProblemCode = cp.ProblemCode,
                    Point = cp.Point,
                    Order = cp.Order,
                    MaximumSubmission = cp.MaximumSubmission
                }).ToList()
            };
        }

        public async Task<bool> SubmitCode(string userId, SubmitCodeContestProblemRequest request)
        {
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var problem = await GetContestProblemByCodeAsync(request.ContestCode, request.ProblemCode);
                if (problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var participant = await GetContestParticipantByCodeAsync(request.ContestCode, userId);
                if (participant == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var contest = await GetContestByCodeAsync(request.ContestCode);
                if (contest == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                if (DateTime.UtcNow > contest.EndTime)
                    throw new BadException(ErrorMessage.ContestEnded);

                var participantProblem = await GetContestParticipantproblemByCodeAsync(request.ProblemCode, participant.Id);
                if (participantProblem != null)
                {
                    if (participantProblem.SubmissionCount >= problem.MaximumSubmission)
                        throw new BadException(ErrorMessage.MaxSubmissionReached);

                    participantProblem.SubmissionCount++;
                    _context.ContestParticipantProblems.Update(participantProblem);
                }
                else
                {
                    participantProblem = new ContestParticipantProblem
                    {
                        ContestParticipantId = participant.Id,
                        ContestProblemId = problem.Id,
                        ContestProblemCode = request.ProblemCode,
                        SubmissionCount = 1
                    };

                    _context.ContestParticipantProblems.Add(participantProblem);
                }

                var submission = new CreateSubmissionRequest
                {
                    SourceCode = request.SourceCode,
                    LanguageId = request.LanguageId,
                    LanguageName = request.LanguageName,
                    ProblemId = problem.ProblemId,
                    ProblemCode = problem.ProblemCode
                };

                await _submissionService.CreateAsync(userId, submission, request.ContestCode, false, true);
                var _problem = await _problemService.GetByCodeAsync(userId, request.ProblemCode);
                if (_problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                double point = (problem.Point != 0 ? _problem.PassedTestCount / _problem.TotalTests : 0) * problem.Point;
                if (participant.Score < point)
                {
                    participant.Score = point;
                    _context.ContestParticipants.Update(participant);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> RegisterContest(string userId, string contestCode)
        {
            var contest = await GetContestByCodeAsync(contestCode);
            if (contest == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            if (contest.StartTime > DateTime.UtcNow)
                throw new BadException(ErrorMessage.ContestNotStarted);

            var participant = await GetContestParticipantByCodeAsync(contestCode, userId);
            if (participant != null)
                throw new BadException(ErrorMessage.AlreadyRegistered);

            participant = new ContestParticipant
            {
                ContestId = contest.Id,
                ContestCode = contest.Code,
                UserId = userId,
                Score = 0
            };

            _context.ContestParticipants.Add(participant);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(List<ContestView> contests, int totalPages)> GetListContestsAsync(Paging query, string userId, bool? isMine = false)
        {
            // Count total contests based on whether it's for a specific user
            int totalItems = await _context.Contests
                .CountAsync(c => isMine == false || c.OrganizationId == userId);

            // Calculate total pages
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);

            // Fetch contests with pagination
            var contests = await _context.Contests.AsNoTracking()
                .Where(c => isMine == false || c.OrganizationId == userId) // Filter if necessary
                .OrderByDescending(c => c.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize)
                .Take(query.pageSize)
                .Select(contest => new ContestView
                {
                    Id = contest.Id,
                    Code = contest.Code,
                    Name = contest.Name,
                    Description = contest.Description,
                    StartTime = contest.StartTime,
                    EndTime = contest.EndTime,
                    Rules = contest.Rules,
                    OrganizationId = contest.OrganizationId,
                    OrganizationName = contest.OrganizationName
                })
                .ToListAsync();

            return (contests, totalPages);
        }

        public async Task<List<ContestProblemView>> GetContestProblemInfoByCodeAsync(string contestCode, string userId)
        {
            // Step 1: Fetch Contest Problems first (no joins, fast)
            var contestProblems = await _context.ContestProblems.AsNoTracking()
                .Where(c => c.ContestCode == contestCode)
                .Include(c => c.Problem) // Include Problem to access problem properties
                .ToListAsync();

            // Step 2: Get the list of ProblemIds from the retrieved contest problems
            var problemIds = contestProblems.Select(cp => cp.ProblemId).ToList();

            // Step 3: Fetch the corresponding ProblemUser records for the userId and ProblemIds
            var problemUsers = await _context.ProblemUsers.AsNoTracking()
                .Where(pu => pu.UserId == userId && problemIds.Contains(pu.ProblemId))
                .ToListAsync();

            // Step 4: Map the contest problems to the DTO
            var contestProblemViews = contestProblems.Select(problem => new ContestProblemView
            {
                Id = problem.Id,
                ProblemId = problem.ProblemId,
                ProblemCode = problem.ProblemCode,
                Point = problem.Point,
                Order = problem.Order,
                MaximumSubmission = problem.MaximumSubmission,
                Title = problem.Problem.Title,
                TimeLimit = problem.Problem.TimeLimit,
                MemoryLimit = problem.Problem.MemoryLimit,
                TotalTests = problem.Problem.TotalTests,
                Difficulty = problem.Problem.Difficulty,
                // Get PassedTestCount from the ProblemUsers list
                PassedTestCount = problemUsers.FirstOrDefault(pu => pu.ProblemId == problem.ProblemId)?.PassedTestCount ?? 0
            })
            .OrderBy(p => p.Order)
            .ToList();

            return contestProblemViews;
        }


        public async Task<List<ContestParticipantView>> GetContestParticipantInfoByCodeAsync(string contestCode)
        {
            return await _context.ContestParticipants.AsNoTracking()
                .Where(c => c.ContestCode == contestCode)
                .Select(participant => new ContestParticipantView
                {
                    Id = participant.Id,
                    UserId = participant.UserId,
                    Score = participant.Score,
                    ContestId = participant.ContestId,
                    ContestCode = participant.ContestCode
                })
                .ToListAsync();
        }

        public async Task<bool> IsRegistered(string contestCode, string userId)
        {
            var participant = await GetContestParticipantByCodeAsync(contestCode, userId);

            return participant != null;
        }
    }
}