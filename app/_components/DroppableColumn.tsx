"use client";

import { ColConfig, Column } from "@/lib/models/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./button";
import CreateJobApplicationDialog from "./CreateJobApplicationDialog";
import SortableJobCard from "./SortableJobCard";
import { useOptimistic, useState } from "react";
import toast from "react-hot-toast";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { deleteColumn } from "@/lib/actions";
import { isLightColor } from "../_utils/helperFunctions";
import EditColumnDialog from "./EditColumnDialog";
import { CSS } from "@dnd-kit/utilities";

interface ColumnProps {
  column: Column;
  config:
    | ColConfig
    | {
        color: string;
        name: string;
        icon: string;
      };
  boardId: string;
  sortedColumns: Column[];
}

export default function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

  const {
    attributes,
    listeners,
    transform,
    isDragging,
    transition,
    setNodeRef: columSetNodeRef,
  } = useSortable({
    id: column._id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacitiy: isDragging ? 0.5 : 1,
  };

  const [optimisticJobs, optimisticDelete] = useOptimistic(
    column.jobApplications,
    (curJobs, jobId) => {
      return curJobs.filter((job) => job._id !== jobId);
    },
  );

  const sortedJobs = optimisticJobs?.sort((a, b) => a.order - b.order) || [];

  async function handleDeleteColumn() {
    if (confirm("Are you sure you want to delete this column?")) {
      try {
        const result = await deleteColumn(column._id);

        if (!result.error) {
          toast.success("Column successfully deleted!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not delete the column!");
      }
    }
  }

  return (
    <div ref={columSetNodeRef} style={style}>
      <Card
        className="min-w-75 [&::-webkit-scrollbar]:hidden h-215 shrink-0 shadow-md p-0 overflow-y-auto cursor-pointer"
        {...attributes}
        {...listeners}
      >
        <CardHeader
          style={{
            backgroundColor: config.color.startsWith("#")
              ? config.color
              : undefined,
          }}
          className={`${!config.color.includes("#") && config.color} text-white  rounded-t-lg pb-3 pt-3`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {config.icon}
              <CardTitle
                className={`${isLightColor(config.color) ? "text-muted-foreground" : "text-white"} text-base font-semibold`}
              >
                {column.name}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteColumn}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent
          ref={setNodeRef}
          className={`space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg dark:bg-card  ${isOver ? "ring-2 ring-blue-500 dark:ring-ring " : ""}`}
        >
          <SortableContext
            items={sortedJobs.map((job) => job._id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedJobs.map((job) => (
              <SortableJobCard
                key={job._id}
                job={{ ...job, columnId: job.columnId || column._id }}
                columns={sortedColumns}
                optimisticDelete={optimisticDelete}
              />
            ))}
          </SortableContext>

          <CreateJobApplicationDialog boardId={boardId} columnId={column._id} />

          <EditColumnDialog
            column={column}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </CardContent>
      </Card>
    </div>
  );
}
