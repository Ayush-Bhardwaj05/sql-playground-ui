import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700',
        outline:
          'border border-[#2d2d2d] bg-transparent text-[#d4d4d4] shadow-xs hover:bg-[#2d2d2d] hover:text-white dark:border-[#2d2d2d] dark:bg-transparent dark:text-[#d4d4d4] dark:hover:bg-[#2d2d2d] dark:hover:text-white',
        secondary:
          'bg-[#2d2d2d] text-[#d4d4d4] shadow-xs hover:bg-[#3d3d3d] hover:text-white dark:bg-[#2d2d2d] dark:text-[#d4d4d4] dark:hover:bg-[#3d3d3d] dark:hover:text-white',
        ghost:
          'text-[#d4d4d4] hover:bg-[#2d2d2d] hover:text-white dark:text-[#d4d4d4] dark:hover:bg-[#2d2d2d] dark:hover:text-white',
        link:
          'text-blue-600 underline-offset-4 hover:underline dark:text-blue-400',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }