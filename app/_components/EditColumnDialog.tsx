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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { isLightColor } from "../_utils/helperFunctions";
import { Column } from "@/lib/models/models.types";
import { updateColumn } from "@/lib/actions";
import { User2Icon } from "lucide-react";

function EditColumnDialog({
  column,
  setIsEditing,
  isEditing,
}: {
  column: Column;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState(column.config?.color ?? "#000");
  const [columnName, setColumnName] = useState(column.name);

  useEffect(() => {
    setIsEditing(false);
  }, [column, setIsEditing]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updatedColumnData = {
        ...column,
        name: columnName,
        config: {
          name: columnName.toLowerCase().split(" ").join("-"),
          icon: "user",
          color: color,
        },
      };

      const result = await updateColumn(column._id, updatedColumnData);

      if (!result.error) {
        toast.success("Sucessfully updated column!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update the column!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Edit Column</DialogTitle>
          <DialogDescription>Update your column settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnName">
                Column name <span className="text-red-500">*</span>
              </Label>
              <Input
                disabled={isSubmitting}
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                id="columnName"
                maxLength={25}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Pick a color (optional)</Label>
              <div className="flex items-center justify-between">
                <HexColorPicker color={color} onChange={setColor} />

                <div className="bg-white dark:bg-card h-50 w-1/2 shadow-xl rounded-lg ">
                  <div
                    style={{ backgroundColor: color }}
                    className={`flex items-center gap-4 p-2 w-full h-10 ${isLightColor(color) ? "text-black" : "text-white"} rounded-t-lg`}
                  >
                    <User2Icon />
                    <span>{columnName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                setIsEditing(false);
                setColumnName(column.name);
              }}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting ? <SpinnerMini /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditColumnDialog;
