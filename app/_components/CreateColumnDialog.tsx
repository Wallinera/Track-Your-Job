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
import { useState } from "react";

import { HexColorPicker } from "react-colorful";
import { NewColumn } from "@/lib/models/models.types";
import { addColumn } from "@/lib/actions";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { isLightColor } from "../_utils/helperFunctions";

function CreateColumnDialog({
  columnsLength,
  boardId,
}: {
  boardId: string;
  columnsLength: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState("#aabbcc");
  const [columnName, setColumnName] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const newColumn: NewColumn = {
        name: columnName,
        jobApplications: [],
        config: {
          name: columnName.toLowerCase().split(" ").join("-"),
          color: color,
          icon: "user",
        },
        order: columnsLength + 1,
      };

      const result = await addColumn(boardId, newColumn);

      if (!result.error) {
        toast.success("Sucessfully added new column!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not add new column!");
    } finally {
      setIsOpen(false);
      setIsSubmitting(false);
      setColor("#aabbcc");
      setColumnName("");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-5">
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Then start adding job applications
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnName">
                Column name {<span className="text-red-500">*</span>}
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
              <Label htmlFor="color">Pick a color (optional)</Label>
              <div className="flex items-center justify-between">
                <HexColorPicker color={color} onChange={setColor} />

                <div className="h-50 w-1/2  shadow-xl rounded-lg">
                  <div
                    style={{
                      backgroundColor: color,
                    }}
                    className={`p-2 w-full h-10 ${isLightColor(color) ? "text-black" : "text-white"} rounded-t-lg`}
                  >
                    {columnName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                setIsOpen(false);
              }}
              variant={"outline"}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting ? <SpinnerMini /> : "Add Column"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateColumnDialog;
