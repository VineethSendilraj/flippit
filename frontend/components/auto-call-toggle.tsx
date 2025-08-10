"use client"

import * as React from "react"
import { Switch } from "@radix-ui/react-switch"
import { Label } from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

export function AutoCallToggle() {
  const [enabled, setEnabled] = React.useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-call-mode"
        checked={enabled}
        onCheckedChange={setEnabled}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          enabled ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            enabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </Switch>
      <Label
        htmlFor="auto-call-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
      >
        Auto Call Mode
      </Label>
    </div>
  )
} 