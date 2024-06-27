using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (currentUser == null) return null;

                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser.UserName;

                var currentUserAttendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == currentUser.UserName);

                // host user can cancel and re-activate an activity
                if (currentUserAttendance != null && hostUsername == currentUser.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                // attendee/guest can leave an activity
                if (currentUserAttendance != null && hostUsername != currentUser.UserName)
                    activity.Attendees.Remove(currentUserAttendance);

                // attendee/guest can join an activity
                if (currentUserAttendance == null)
                {
                    currentUserAttendance = new ActivityAttendee
                    {
                        AppUser = currentUser,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(currentUserAttendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}