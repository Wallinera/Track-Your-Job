"use client";

import { updateColumnOrders, updateJobApplication } from "@/lib/actions";
import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import toast from "react-hot-toast";

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  if (initialBoard !== board) {
    setBoard(initialBoard!);
    setColumns(initialBoard?.columns || []);
  }

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      // Find and remove job from the old column

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const col of newColumns) {
        const jobIndex = col.jobApplications.findIndex(
          (j) => j._id === jobApplicationId,
        );
        if (jobIndex !== -1 && jobIndex !== undefined) {
          jobToMove = col.jobApplications[jobIndex];
          oldColumnId = col._id;
          col.jobApplications = col.jobApplications.filter(
            (job) => job._id !== jobApplicationId,
          );
          break;
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col._id === newColumnId,
        );
        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentJobs = targetColumn.jobApplications || [];

          const updatedJobs = [...currentJobs];
          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
            ...job,
            order: idx * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      const result = await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });
    } catch (err) {
      console.error("Error", err);
    }
  }

  async function moveColumn(
    activeIndex: number,
    overIndex: number,
  ): Promise<void> {
    const prevColumns = columns;

    const reorderedColumns = arrayMove(columns, activeIndex, overIndex).map(
      (col, index) => ({ ...col, order: index }),
    );

    setColumns(reorderedColumns); // optimistic update

    // derive orders directly from the reordered array
    const updateArray = reorderedColumns.map((col) => ({
      columnId: col._id,
      order: col.order,
    }));

    const result = await updateColumnOrders(updateArray);

    if (result?.error) {
      setColumns(prevColumns);
      toast.error("Could not reorder columns!");
    }
  }

  function getCurColumn(columnId: string) {
    const curColumn = columns.find((col) => col._id === columnId);

    return curColumn;
  }

  return { board, columns, error, moveJob, getCurColumn, moveColumn };
}
