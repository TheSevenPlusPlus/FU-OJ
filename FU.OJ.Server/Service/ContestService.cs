using Exceptions;
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
        public Task<ContestView> GetContestInfoAsync(string contestCode);
        public Task<bool> SubmitCode(string userId, SubmitCodeContestProblemRequest request);
        public Task<bool> RegisterContest(string userId, string contestCode);
        public Task<List<ContestView>> GetListContestsAsync();
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

            var user = await _userService.GetUserByIdAsync(request.OrganizationUserId);
            if (user == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                throw new NotFoundException(ErrorMessage.NotFound);

            contest = new Contest
            {
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                OrganizationUserId = request.OrganizationUserId,
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
            return contest.Id;
        }

        public async Task<ContestView> GetContestInfoAsync(string contestCode)
        {
            var contest = await _context.Contests.AsNoTracking()
                .Include(c => c.ContestParticipants)
                .Include(c => c.ContestProblems)
                .FirstOrDefaultAsync(c => c.Id == contestCode);

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
                OrganizationUserId = contest.OrganizationUserId,
                Participants = contest.ContestParticipants,
                Problems = contest.ContestProblems
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

                if (DateTime.UtcNow > problem.Contest.EndTime)
                    throw new BadException(ErrorMessage.ContestEnded);

                var participantProblem = await GetContestParticipantproblemByCodeAsync(request.ProblemCode, userId);
                if (participantProblem != null)
                {
                    if (participantProblem.SubmissionCount == problem.MaximumSubmission)
                        throw new BadException(ErrorMessage.MaxSubmissionReached);

                    participantProblem.SubmissionCount++;
                    _context.ContestParticipantProblems.Update(participantProblem);
                }
                else
                {
                    participantProblem = new ContestParticipantProblem
                    {
                        ContestParticipantId = userId,
                        ContestProblemId = request.ProblemId,
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

                await _submissionService.CreateAsync(userId, submission, false, true);
                var _problem = await _problemService.GetByCodeAsync(userId, request.ProblemCode);
                if (_problem == null)
                    throw new NotFoundException(ErrorMessage.NotFound);

                double point = problem.Point != 0 ? _problem.PassedTestCount / _problem.TotalTests : 0;
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

        public async Task<List<ContestView>> GetListContestsAsync()
        {
            return await _context.Contests.AsNoTracking()
                .Include(c => c.ContestParticipants)
                .Include(c => c.ContestProblems)
                .Select(contest => new ContestView
                {
                    Id = contest.Id,
                    Code = contest.Code,
                    Name = contest.Name,
                    Description = contest.Description,
                    StartTime = contest.StartTime,
                    EndTime = contest.EndTime,
                    Rules = contest.Rules,
                    OrganizationUserId = contest.OrganizationUserId,
                    Participants = contest.ContestParticipants,
                    Problems = contest.ContestProblems
                })
                .ToListAsync();
        }
    }
}
