import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  AlarmClockIcon,
  CalendarArrowUpIcon,
  CalendarClockIcon,
  Clock4Icon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { Separator } from "./ui/separator";
import { DateTimePickerPopover } from "./date-time-picker-dialog";
import { cn } from "@/lib/utils";
import { getRelativeDateTimeText } from "@/lib/strings";
import { useState } from "react";

export type ReminderFieldProps = {
  value?: Date | null;
  onChange: (value?: Date | null) => void;
};

export const ReminderField = ({ onChange, value }: ReminderFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size={value ? "default" : "icon"}
            variant="ghost"
            className={cn(value && "bg-accent hover:bg-accent px-2")}
            tooltip={"Remind me"}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".clear-button")) {
                e.preventDefault();
                onChange(null);
              }
            }}
          >
            <AlarmClockIcon />
            {getRelativeDateTimeText(value, true)}
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
                const today = new Date();
                const laterToday = setMinutes(
                  new Date(today.getTime() + 4 * 60 * 60 * 1000),
                  0
                ); // Add 4 hours
                onChange(laterToday);
                setOpen(false);
              }}
            >
              <Clock4Icon />
              Today{" "}
              {format(
                new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
                "h a"
              )}
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                const tomorrow = addDays(new Date(), 1);
                onChange(setHours(setMinutes(tomorrow, 0), 9));
                setOpen(false);
              }}
            >
              <SunIcon />
              Tomorrow 9 AM
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                const nextWeek = addDays(new Date(), 7);
                onChange(setHours(setMinutes(nextWeek, 0), 9));
                setOpen(false);
              }}
            >
              <CalendarArrowUpIcon />
              Next week, 9 AM
            </Button>
            <Separator className="my-1" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"ghost"}
                  className={cn("w-full justify-start text-left font-normal")}
                >
                  <CalendarClockIcon />
                  Pick date & time
                </Button>
              </PopoverTrigger>
              <DateTimePickerPopover
                value={value}
                onOpenChange={setOpen}
                onSelect={onChange}
              />
            </Popover>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

