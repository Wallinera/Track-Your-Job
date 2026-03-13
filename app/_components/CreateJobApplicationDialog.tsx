"use client";

import { Plus } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "./textarea";
import { useEffect, useState } from "react";
import {
  JobApplicationData,
  JobApplicationFormInputs,
} from "@/lib/models/models.types";
import { createJobApplication } from "@/lib/actions";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const onSubmit: SubmitHandler<JobApplicationFormInputs> = async (
    formData,
  ) => {
    try {
      const newTags =
        formData.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0) || [];

      const newJobApplicationObject: JobApplicationData = {
        ...formData,
        tags: newTags,
        boardId,
        columnId,
      };

      const result = await createJobApplication(newJobApplicationObject);

      if (!result.error) {
        toast.success("Successfully created new job application!");
      }
      setIsOpen((s) => !s);
    } catch (error) {
      toast.error("Could not create job application!");
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
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
                  disabled={isSubmitting}
                  id="location"
                  {...register("location")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
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
                disabled={isSubmitting}
                id="jobUrl"
                placeholder="https://..."
                {...register("jobUrl")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-seperated)</Label>
              <Input
                disabled={isSubmitting}
                id="tags"
                placeholder="React, Tailwind, High pay"
                {...register("tags")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
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
                setIsOpen(false);
                reset();
              }}
              variant={"outline"}
              type="button"
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <SpinnerMini /> : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateJobApplicationDialog;
