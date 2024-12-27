import React from "react"
import { TabsTrigger } from "./ui/tabs"
import { cn } from "@/lib/utils"
import { X, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const CloseableTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger> & { onClose?: () => void }
>(({ className, onClose, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      "relative group justify-start w-44 h-9 pl-2 pr-3 rounded-none border-l border-r data-[state=inactive]:border-t data-[state=active]:border-t-2 data-[state=active]:border-t-pink-800 data-[state=active]:shadow-none",
      className
    )}
    {...props}
  >
    {props.children && (
        <Tooltip>
            <TooltipTrigger asChild>
                <p className="truncate pr-2">{props.children}</p>
            </TooltipTrigger>
            <TooltipContent
                side="bottom"
                align="start"
                {...{children: props.children}}
            />
        </Tooltip>
    )}
    {onClose && (
        <Tooltip>
            <TooltipTrigger asChild>
                <X onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    }}
                    className="absolute right-1 w-4 h-4 ml-2 text-xs group-hover:group-hover group-hover:visible hover:text-red-700 group-data-[state=active]:text-red-700 group-data-[state=active]:visible group-data-[state=inactive]:hidden"
                ></X>
            </TooltipTrigger>
            <TooltipContent
                side="bottom"
                align="center"
                {...{children: "Close Tab"}}
            />
        </Tooltip>
    )}
  </TabsTrigger>
))
CloseableTabsTrigger.displayName = TabsTrigger.displayName;

export { CloseableTabsTrigger }