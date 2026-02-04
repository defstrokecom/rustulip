import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
        secondary:
          "bg-zinc-800 text-zinc-300",
        success:
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        warning:
          "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        danger:
          "bg-red-500/20 text-red-400 border border-red-500/30",
        outline:
          "border border-zinc-700 text-zinc-300",
        new:
          "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        hit:
          "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
