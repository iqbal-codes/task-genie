import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  CalendarArrowUpIcon,
  CalendarDaysIcon,
  CalendarIcon,
  Clock4Icon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { addDays } from "date-fns";
import { Separator } from "./ui/separator";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getRelativeDateTimeText } from "@/lib/strings";

export type DueDateFieldProps = {
  value?: Date | null;
  onChange: (value?: Date | null) => void;
};

export const DueDateField = ({ onChange, value }: DueDateFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={value ? "default" : "icon"}
          variant="ghost"
          className={cn(value && "bg-accent hover:bg-accent px-2")}
          tooltip={value ? "Due date" : "Add due date"}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest(".clear-button")) {
              e.preventDefault();
              onChange(null);
            }
          }}
        >
          <CalendarIcon />
          {getRelativeDateTimeText(value, false)}
          {value && (
            <div className="clear-button ml-2 cursor-pointer rounded-sm hover:bg-gray-200">
              <XIcon />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onChange(new Date());
              setOpen(false);
            }}
          >
            <Clock4Icon />
            Today
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onChange(addDays(new Date(), 1));
              setOpen(false);
            }}
          >
            <SunIcon />
            Tomorrow
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onChange(addDays(new Date(), 7));
              setOpen(false);
            }}
          >
            <CalendarArrowUpIcon />
            Next week
          </Button>
          <Separator className="my-1" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"ghost"}
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarDaysIcon />
                Pick a date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={value || undefined}
                selected={value || undefined}
                onSelect={(date) => {
                  onChange(date);
                  setOpen(false);
                }}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
};

