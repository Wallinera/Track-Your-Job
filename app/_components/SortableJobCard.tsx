"use client";
import { Column, JobApplication } from "@/lib/models/models.types";
import JobApplicationCard from "./JobApplicationCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableJobCard({
  job,
  columns,
  optimisticDelete,
}: {
  job: JobApplication;
  columns: Column[];
  optimisticDelete: (action: unknown) => void;
}) {
  const {
    attributes,
    listeners,
    transform,
    isDragging,
    transition,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacitiy: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
        optimisticDelete={optimisticDelete}
      />
    </div>
  );
}

export default SortableJobCard;
