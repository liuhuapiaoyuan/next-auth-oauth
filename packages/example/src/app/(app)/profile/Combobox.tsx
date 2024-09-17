'use client'
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";

export type ComboboxProps = {
  
  options?:Array<{label:React.ReactNode,value:string}>
  placeHolder?:React.ReactNode
  emptyMessage?:React.ReactNode
  commandInputProps?:  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
} & ({
  mode?:"single"
  value?: string;
  onChange?: (value: string) => void;
} |{
  mode:"multiple"
  value?: string[];
  onChange?: (value: string[]) => void;
})

  export function Combobox(props:ComboboxProps) {
    const {mode, options=[] , emptyMessage , commandInputProps={} ,placeHolder} = props

    function checkValue(value:string){
      if(mode === "multiple"){
        return props.value?.includes(value)
      }
      return value === props.value
    }
    function onSelected(value:string){
      if(mode === "multiple"){
        const newValue = props.value?.includes(value)? props.value?.filter(v=>v!==value) : [...(props.value || []),value]
        props.onChange?.(newValue)
      }else{
        props.onChange?.(value)
      }
    }
    const selectOptions = options.filter(item=>checkValue(item.value))
    return (
      <Popover >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="min-w-[200px] flex gap-1  justify-between"
          >
            {
              selectOptions.map(item=><span className="px-1 border  rounded-xs hover:bg-accent text-accent-foreground " key={item.value}>
                {item.label}
              </span>)
            }
            {
              selectOptions.length === 0 && (placeHolder ?? <span className="">请选择</span>)
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="检索..." {...commandInputProps} />
            <CommandList>
              <CommandEmpty>{emptyMessage??"没有相关信息"}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={onSelected}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        checkValue( item.value)? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }