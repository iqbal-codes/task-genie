"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog } from "./ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ModalAddTask } from "./modal-add-task";

const ButtonAddTask = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={20} />
          Add Task
        </Button>
      </DialogTrigger>
      <ModalAddTask setOpen={setOpen} />
    </Dialog>
  );
};

export default ButtonAddTask;
