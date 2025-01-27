"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          {value ? (
            <div className="flex items-center">
              <span className="text-xl">{value}</span>
            </div>
          ) : (
            <SmilePlus className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" side="right" align="start">
        <EmojiPicker
          lazyLoadEmojis
          onEmojiClick={(emojiData: EmojiClickData) => {
            setIsOpen(false);
            onChange(emojiData.emoji);
          }}
          width="100%"
          height={360}
        />
      </PopoverContent>
    </Popover>
  );
}

