"use client";

import {
  Board,
  ColConfig,
  Column,
  JobApplication,
} from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  User2Icon,
  XCircle,
} from "lucide-react";
import DroppableColumn from "./DroppableColumn";
import { useBoard } from "../_hooks/useBoard";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

interface KanbanBoardProps {
  userId: string | undefined;
  board: Board;
}

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-cyan-500 dark:bg-chart-1",
    icon: <Calendar className="h-4 w-4" />,
    name: "wish-list",
  },
  {
    color: "bg-purple-500 dark:bg-chart-2",
    icon: <CheckCircle2 className="h-4 w-4" />,
    name: "applied",
  },
  {
    color: "bg-green-500 dark:bg-chart-3",
    icon: <Mic className="h-4 w-4" />,
    name: "interviewing",
  },
  {
    color: "bg-yellow-500 dark:bg-chart-4",
    icon: <Award className="h-4 w-4" />,
    name: "offer",
  },
  {
    color: "bg-red-500 dark:bg-chart-5",
    icon: <XCircle className="h-4 w-4" />,
    name: "rejected",
  },
];

function KanbanBoard({ board }: KanbanBoardProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const { columns, moveJob, moveColumn } = useBoard(board);

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { setNodeRef, isOver } = useDroppable({
    id: board._id,
    data: {
      type: "board",
      boardId: board._id,
    },
  });

  async function handleDragStart(event: DragStartEvent) {
    setActiveItemId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveItemId(null);

    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if dragging a column
    const isActiveColumn = sortedColumns.some((col) => col._id === activeId);
    const isOverColumn = sortedColumns.some((col) => col._id === overId);

    if (isActiveColumn && isOverColumn) {
      const activeIndex = sortedColumns.findIndex(
        (col) => col._id === activeId,
      );
      const overIndex = sortedColumns.findIndex((col) => col._id === overId);
      await moveColumn(activeIndex, overIndex);
      return;
    }

    // Otherwise handle job application drag
    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs =
        column.jobApplications.sort((a, b) => a.order - b.order) || [];
      const jobIndex = jobs.findIndex((j) => j._id === activeId);
      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTarget =
        targetColumn.jobApplications
          .filter((j) => j._id !== activeId)
          .sort((a, b) => a.order - b.order) || [];
      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) =>
        col.jobApplications.some((j) => j._id === targetJob._id),
      );
      targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col._id === targetColumnId,
      );
      if (!targetColumnObj) return;

      const allJobsInTargetOriginal =
        targetColumnObj.jobApplications.sort((a, b) => a.order - b.order) || [];
      const allJobsInTargetFiltered =
        allJobsInTargetOriginal.filter((j) => j._id !== activeId) || [];
      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId,
      );
      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        (j) => j._id === overId,
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          newOrder =
            sourceIndex < targetIndexInOriginal
              ? targetIndexInFiltered + 1
              : targetIndexInFiltered;
        } else {
          newOrder = targetIndexInFiltered;
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) return;

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeItemId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div
          ref={setNodeRef}
          className={`flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden  pb-4 ${isOver ? "ring-2 ring-blue-500 dark:ring-ring " : ""}`}
        >
          <SortableContext
            items={sortedColumns.map((col) => col._id)}
            strategy={horizontalListSortingStrategy}
          >
            {sortedColumns?.map((col) => {
              let config;

              if (!col.config) {
                config = COLUMN_CONFIG.find(
                  (conf) =>
                    conf.name === col.name.toLowerCase().split(" ").join("-"),
                ) || {
                  color: "bg-gray-500",
                  icon: <Calendar className="h-4 w-4" />,
                  name: "Default",
                };
              }
              if (col.config?.icon === "user") {
                config = {
                  name: col.config.name,
                  color: col.config.color,
                  icon: <User2Icon />,
                };
              }

              return (
                <DroppableColumn
                  key={col._id}
                  column={col}
                  config={config!}
                  boardId={board._id}
                  sortedColumns={sortedColumns}
                />
              );
            })}
          </SortableContext>
        </div>
      </div>

      {/* <DragOverlay>
        {activeJob ? (
          <div className="opacity-50 ">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay> */}

      {activeJob && (
        <DragOverlay>
          <div className="opacity-50 ">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
}

export default KanbanBoard;
