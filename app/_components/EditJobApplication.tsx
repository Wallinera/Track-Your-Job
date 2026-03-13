"use client";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "./textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  JobApplication,
  JobApplicationFormInputs,
} from "@/lib/models/models.types";
import { updateJobApplication } from "@/lib/actions";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

interface EditjobApplicationProps {
  job: JobApplication;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

function EditjobApplication({
  job,
  isEditing,
  setIsEditing,
}: EditjobApplicationProps) {
  const [existingJobData, setExistingJobData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    setIsEditing(false);
  }, [job, setIsEditing]);

  const onSubmit: SubmitHandler<JobApplicationFormInputs> = async (
    formData,
  ) => {
    try {
      const newTags =
        formData.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0) || [];

      const updatedJobApplicationObject = {
        ...formData,
        tags: newTags,
        columnId: job.columnId!,
      };

      const result = await updateJobApplication(
        job._id,
        updatedJobApplicationObject,
      );

      if (!result.error) {
        toast.success("Successfully updated the job application!");
      }
    } catch (error) {
      toast.error("Could not update the job application!");
      console.error(error);
    }
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Edit Job Application</DialogTitle>
          <DialogDescription>Update job application</DialogDescription>
        </DialogHeader>

        {(errors.company || errors.position) && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            Company & Position fields should be filled!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company {<span className="text-red-500">*</span>}
                </Label>
                <Input
                  disabled={isSubmitting}
                  id="company"
                  defaultValue={existingJobData.company}
                  {...register("company", {
                    required: "This field is required!",
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Position {<span className="text-red-500">*</span>}
                </Label>
                <Input
                  disabled={isSubmitting}
                  defaultValue={existingJobData.position}
                  id="position"
                  {...register("position", {
                    required: "This field is required!",
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  defaultValue={existingJobData.location}
                  disabled={isSubmitting}
                  id="location"
                  {...register("location")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  defaultValue={existingJobData.salary}
                  disabled={isSubmitting}
                  id="salary"
                  placeholder="e.g., $100k - $150k"
                  {...register("salary")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                defaultValue={existingJobData.jobUrl}
                disabled={isSubmitting}
                id="jobUrl"
                placeholder="https://..."
                {...register("jobUrl")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-seperated)</Label>
              <Input
                defaultValue={existingJobData.tags}
                disabled={isSubmitting}
                id="tags"
                placeholder="React, Tailwind, High pay"
                {...register("tags")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                defaultValue={existingJobData.description}
                disabled={isSubmitting}
                rows={3}
                id="description"
                placeholder="Brief description of the role..."
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                defaultValue={existingJobData.notes}
                disabled={isSubmitting}
                rows={4}
                id="notes"
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                setIsEditing(false);
              }}
              variant={"outline"}
              type="button"
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <SpinnerMini /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditjobApplication;
