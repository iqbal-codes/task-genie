"use client";

import { Dialog, DialogTrigger } from "./ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ModalAddTask } from "./modal-add-task";

const ButtonAddTaskList = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
          <Plus size={20} />
          Add Task
        </Button>
      </DialogTrigger>
      <ModalAddTask setOpen={setOpen} />
    </Dialog>
  );
};

export default ButtonAddTaskList;
