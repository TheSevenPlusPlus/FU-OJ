using Exceptions;
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
        public Task<string> SubmitCode(string userId, SubmitCodeContestProblemRequest request);
        public Task<bool> RegisterContest(string userId, string contestCode);
        public Task<(List<ContestView> contests,  int totalPages)> GetListContestsAsync(Paging query, string userId, bool? isMine = false);
        public Task<List<ContestProblemView>> GetContestProblemInfoByCodeAsync(string contestCode, string userId);
        public Task<List<ContestParticipantView>> GetContestParticipantInfoByCodeAsync(string contestCode);
        public Task<bool> IsRegistered(string contestCode, string userId);
        public Task<List<ContestParticipantView>> GetRank(string contestCode);
        public Task<string> UpdateContestAsync(string userId, string contestCode, UpdateContestRequest request);
        public Task<bool> DeleteAsync(string userId, string id);
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

        public async Task<string> CreateContestAsync(string userId, CreateContestRequest request)
        {
            var contest = await GetContestByCodeAsync(request.Code);
            if (contest != null)
                throw new BadException(ErrorMessage.ContestCodeExisted);

            if (request.StartTime > request.EndTime)
                throw new BadException(ErrorMessage.StartTimeGreaterThanEndTime);

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            contest = new Contest
            {
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                OrganizationId = userId,
                CreatedAt = DateTime.UtcNow,
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

        public async Task<bool> DeleteAsync(string userId, string id)
        {
            var contest = await _context.Contests.FirstOrDefaultAsync(p => p.Id == id && p.OrganizationId == userId);

            if (contest == null)
                throw new Exception(ErrorMessage.NotFound);

            _context.Contests.Remove(contest);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> UpdateContestAsync(string userId, string contestCode, UpdateContestRequest request)
        {
            var contest = await _context.Contests.FirstOrDefaultAsync(c => c.Code == contestCode && c.OrganizationId == userId);
            if (contest == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            if (request.StartTime > request.EndTime)
                throw new BadException(ErrorMessage.StartTimeGreaterThanEndTime);

            contest.Name = request.Name;
            contest.Description = request.Description;
            contest.StartTime = request.StartTime;
            contest.EndTime = request.EndTime;
            contest.Rules = request.Rules;

            // Update contest problems if needed
            foreach (var contestProblem in request.Problems)
            {
                var problem = await _problemService.GetByCodeAsync(contest.OrganizationId, contestProblem.ProblemCode);
                if (problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var existingContestProblem = await _context.ContestProblems
                    .FirstOrDefaultAsync(cp => cp.ContestId == contest.Id && cp.ProblemCode == contestProblem.ProblemCode);

                if (existingContestProblem != null)
                {
                    existingContestProblem.Order = contestProblem.Order;
                    existingContestProblem.Point = contestProblem.Point;
                }
                else
                {
                    var newContestProblem = new ContestProblem
                    {
                        ContestId = contest.Id,
                        ContestCode = contest.Code,
                        ProblemId = problem.Id,
                        ProblemCode = problem.Code,
                        Order = contestProblem.Order,
                        Point = contestProblem.Point
                    };
                    _context.ContestProblems.Add(newContestProblem);
                }
            }

            await _context.SaveChangesAsync();
            return contest.Id;
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
                    Order = cp.Order
                }).ToList()
            };
        }

        public async Task<string> SubmitCode(string userId, SubmitCodeContestProblemRequest request)
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

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var contest = await GetContestByCodeAsync(request.ContestCode);
                if (contest == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                if (DateTime.UtcNow > contest.EndTime)
                    throw new BadException(ErrorMessage.ContestEnded);

                var submission = new CreateSubmissionRequest
                {
                    SourceCode = request.SourceCode,
                    LanguageId = request.LanguageId,
                    LanguageName = request.LanguageName,
                    ProblemId = problem.ProblemId,
                    ProblemCode = problem.ProblemCode
                };
                   
                var submissionId = await _submissionService.CreateAsync(userId, submission, request.ContestCode, false, true);
                var _problem = await _problemService.GetByCodeAsync(userId, request.ProblemCode);
                if (_problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                var rank = await _context.contestRanks.AsNoTracking()
                    .FirstOrDefaultAsync(r => r.ContestParticipantId == participant.Id && r.ContestProblemId == problem.Id);

                if (rank == null)
                {
                    double point = 1.0 * _problem.PassedTestCount / (double) _problem.TotalTests * problem.Point;
                    rank = new ContestRank
                    {
                        ContestParticipantId = participant.Id,
                        ContestProblemId = problem.Id,
                        ContestProblemCode = problem.ProblemCode,
                        ContestParticipantName = user.UserName,
                        PassedTestCount = _problem.PassedTestCount,
                        Point = point
                    };

                    _context.contestRanks.Add(rank);

                    participant.Score += point;
                    _context.ContestParticipants.Update(participant);
                }
                else
                {
                    if (_problem.PassedTestCount > rank.PassedTestCount)
                    {
                        double point = _problem.PassedTestCount / _problem.TotalTests * problem.Point;
                        double oldPoint = rank.PassedTestCount / _problem.TotalTests * problem.Point;
                        rank.PassedTestCount = _problem.PassedTestCount;
                        rank.Point = point;
                        _context.contestRanks.Update(rank);
                        participant.Score += point - oldPoint;
                        _context.ContestParticipants.Update(participant);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return submissionId;
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }
        }

        public async Task<bool> RegisterContest(string userId, string contestCode)
        {
            var contest = await GetContestByCodeAsync(contestCode);
            if (contest == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            if (contest.StartTime > DateTime.UtcNow)
                throw new BadException(ErrorMessage.ContestNotStarted);

            if (contest.EndTime < DateTime.UtcNow)
                throw new BadException(ErrorMessage.ContestEnded);

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
            var problemIds = contestProblems.Select(cp => cp.Id).ToList();

            var participant = await GetContestParticipantByCodeAsync(contestCode, userId);
            if (participant == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            // Step 3: Fetch the corresponding ProblemUser records for the userId and ProblemIds
            var contestRank = await _context.contestRanks.AsNoTracking()
                .Where(pu => pu.ContestParticipantId == participant.Id && problemIds.Contains(pu.ContestProblemId))
                .ToListAsync();

            // Step 4: Map the contest problems to the DTO
            var contestProblemViews = contestProblems.Select(problem => new ContestProblemView
            {
                Id = problem.Id,
                ProblemId = problem.ProblemId,
                ProblemCode = problem.ProblemCode,
                Point = problem.Point,
                Order = problem.Order,
                Title = problem.Problem.Title,
                TimeLimit = problem.Problem.TimeLimit,
                MemoryLimit = problem.Problem.MemoryLimit,
                TotalTests = problem.Problem.TotalTests,
                Difficulty = problem.Problem.Difficulty,
                // Get PassedTestCount from the ProblemUsers list
                PassedTestCount = contestRank.FirstOrDefault(pu => pu.ContestProblemId == problem.Id)?.PassedTestCount ?? 0
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
                    ContestCode = participant.ContestCode,
                    UserName = participant.User.UserName
                })
                .ToListAsync();
        }

        public async Task<List<ContestParticipantView>> GetRank(string contestCode)
        {
            // Step 1: Fetch participants based on the contest code
            var participants = await _context.ContestParticipants.AsNoTracking()
                .Where(c => c.ContestCode == contestCode)
                .Select(participant => new ContestParticipantView
                {
                    Id = participant.Id,
                    UserId = participant.UserId,
                    UserName= participant.User.UserName,
                    ContestId = participant.ContestId,
                    ContestCode = participant.ContestCode,
                    Score = participant.Score
                })
                .ToListAsync();

            // Step 2: Fetch contest problems for the contest code
            var contestProblems = await _context.ContestProblems.AsNoTracking()
                .Where(c => c.ContestCode == contestCode)
                .Include(c => c.Problem)
                .ToListAsync();

            // Step 3: Get a list of problem ids for the contest
            var problemIds = contestProblems.Select(cp => cp.Id).ToList();

            // Step 4: Fetch the ProblemUser records for all participants and problems
            var contestRank = await _context.contestRanks.AsNoTracking()
                .Where(pu => problemIds.Contains(pu.ContestProblemId) && participants.Select(p => p.Id).Contains(pu.ContestParticipantId))
                .ToListAsync();

            // Step 5: For each participant, map the problems
            foreach (var participant in participants)
            {
                var participantProblems = contestProblems.Select(problem => new ContestProblemView
                {
                    Id = problem.Id,
                    ProblemId = problem.ProblemId,
                    ProblemCode = problem.ProblemCode,
                    Point = problem.Point,
                    Order = problem.Order,
                    Title = problem.Problem.Title,
                    TimeLimit = problem.Problem.TimeLimit,
                    MemoryLimit = problem.Problem.MemoryLimit,
                    TotalTests = problem.Problem.TotalTests,
                    Difficulty = problem.Problem.Difficulty,
                    // PassedTestCount from the ProblemUsers list for the specific participant
                    PassedTestCount = contestRank
                        .FirstOrDefault(pu => pu.ContestProblemId == problem.Id && pu.ContestParticipantId == participant.Id)?.PassedTestCount ?? 0
                })
                .OrderBy(p => p.Order)
                .ToList();

                participant.Problems = participantProblems; // Set the problems list for each participant
            }

            return participants;
        }

        public async Task<bool> IsRegistered(string contestCode, string userId)
        {
            var participant = await GetContestParticipantByCodeAsync(contestCode, userId);

            return participant != null;
        }
    }
}
