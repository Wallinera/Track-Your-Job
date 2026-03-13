import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import KanbanBoard from "../_components/KanbanBoard";
import CreateColumnDialog from "../_components/CreateColumnDialog";

export const metadata = {
  title: "Track Your Job | Dashboard",
};

async function page() {
  const session = await getSession();

  await connectDB();
  const board = await Board.findOne({
    userId: session?.user.id,
    name: "Job Hunt",
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-background  ">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-white/80">
              {board.name}
            </h1>
            <p className="text-gray-500 dark:text-muted-foreground">
              Track your job applications
            </p>
          </div>

          <CreateColumnDialog
            boardId={JSON.parse(JSON.stringify(board._id))}
            columnsLength={board.columns.length}
          />
        </div>
        <KanbanBoard
          userId={session?.user.id}
          board={JSON.parse(JSON.stringify(board))}
        />
      </div>
    </div>
  );
}

export default page;
