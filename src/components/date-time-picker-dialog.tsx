import { Button } from "./ui/button";
import { PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { format, setHours } from "date-fns";

interface DateTimePickerPopoverProps {
  value?: Date | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (date: Date) => void;
}

const HOURS_LIST = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_LIST = Array.from({ length: 12 }, (_, i) => i * 5);

export function DateTimePickerPopover({
  value,
  onOpenChange,
  onSelect,
}: DateTimePickerPopoverProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHour, setSelectedHour] = useState<string>();
  const [selectedMinute, setSelectedMinute] = useState<string>();

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedHour(value.getHours().toString());
      setSelectedMinute(value.getMinutes().toString());
    }
  }, [value]);

  const handleSave = () => {
    if (selectedDate && selectedHour && selectedMinute) {
      const date = new Date(selectedDate);
      date.setHours(parseInt(selectedHour), parseInt(selectedMinute));
      onSelect(date);
      onOpenChange(false);
    }
  };

  return (
    <PopoverContent className="w-auto p-4" align="start">
      <div className="flex flex-col gap-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={{ before: new Date() }}
          initialFocus
        />
        <div className="flex gap-2">
          <Select value={selectedHour} onValueChange={setSelectedHour}>
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {HOURS_LIST.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {format(setHours(new Date(), hour), "hh a")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMinute} onValueChange={setSelectedMinute}>
            <SelectTrigger>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {MINUTES_LIST.map((minute) => (
                <SelectItem key={minute} value={minute.toString()}>
                  {minute.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </PopoverContent>
  );
}

