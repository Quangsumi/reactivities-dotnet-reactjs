using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Commmand : IRequest {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Commmand>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task Handle(Commmand request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id, cancellationToken);

                _context.Activities.Remove(activity);

                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}