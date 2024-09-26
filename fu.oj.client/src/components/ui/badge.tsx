import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",

                // Trạng thái với màu cụ thể
                accepted: "bg-green-500 text-white", // Màu xanh lá cho 'Accepted'
                wrongAnswer: "bg-red-500 text-white", // Màu đỏ cho 'Wrong Answer'
                timeLimitExceeded: "bg-gray-500 text-white", // Màu xám cho 'Time Limit Exceeded'
                runtimeError: "bg-gray-500 text-white", // Màu xám cho 'Runtime Error'
                memoryLimitExceeded: "bg-gray-500 text-white", // Màu xám cho 'Memory Limit Exceeded'
                compilerError: "bg-gray-500 text-white", // Màu xám cho 'Compiler Error'
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
