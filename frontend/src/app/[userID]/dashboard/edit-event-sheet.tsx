"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconPencil } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldDescription
} from "@/components/ui/field"

// Schema (Same as Create, but without refining dates strictly against "now" to allow minor edits)
const eventFormSchema = z.object({
    Name: z.string().min(3, "Event name is too short"),
    description: z.string().min(10, "Description must be detailed"),
    eligibility: z.string().min(1, "Eligibility criteria required"),
    registrationDeadline: z.string(), 
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    registrationLimit: z.any(), // Accept string or number, handle in submit
    registrationFee: z.any(),
    tags: z.string().optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface EditEventSheetProps {
    event: any;
    onUpdate: () => void;
}

export function EditEventSheet({ event, onUpdate }: EditEventSheetProps) {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    // Helper to format ISO date to datetime-local (YYYY-MM-DDTHH:mm)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return ""
        return new Date(dateStr).toISOString().slice(0, 16)
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            Name: event.Name,
            description: event.description,
            eligibility: event.eligibility,
            registrationDeadline: formatDate(event.registrationDeadline),
            startDate: formatDate(event.startDate),
            endDate: formatDate(event.endDate),
            registrationLimit: event.registrationLimit,
            registrationFee: event.registrationFee,
            tags: event.tags ? event.tags.join(', ') : ""
        }
    })

    const onSubmit = async (data: EventFormValues) => {
        try {
            const payload = {
                ...data,
                registrationLimit: Number(data.registrationLimit),
                registrationFee: Number(data.registrationFee),
                tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags,
            }

            const response = await fetch(`/api/events/${event._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const err = await response.json()
                toast.error(err.error || "Failed to update event")
                return
            }

            toast.success("Event updated successfully")
            setOpen(false)
            onUpdate() // Refresh parent list
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred")
        }
    }

    const isInvalid = (error: any) => error ? true : undefined;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <IconPencil size={16} />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit Event</SheetTitle>
                    <SheetDescription>
                        Make changes to your event details here.
                    </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
                    <FieldGroup>
                        <Field data-invalid={isInvalid(errors.Name)}>
                            <FieldLabel>Event Name</FieldLabel>
                            <Input {...register("Name")} />
                            <FieldError errors={[errors.Name]} />
                        </Field>

                        <Field data-invalid={isInvalid(errors.description)}>
                            <FieldLabel>Description</FieldLabel>
                            <Input {...register("description")} />
                            <FieldError errors={[errors.description]} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={isInvalid(errors.startDate)}>
                                <FieldLabel>Start Date</FieldLabel>
                                <Input type="datetime-local" {...register("startDate")} />
                                <FieldError errors={[errors.startDate]} />
                            </Field>

                            <Field data-invalid={isInvalid(errors.endDate)}>
                                <FieldLabel>End Date</FieldLabel>
                                <Input type="datetime-local" {...register("endDate")} />
                                <FieldError errors={[errors.endDate]} />
                            </Field>
                        </div>

                        <Field data-invalid={isInvalid(errors.registrationDeadline)}>
                            <FieldLabel>Registration Deadline</FieldLabel>
                            <Input type="datetime-local" {...register("registrationDeadline")} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Max Participants</FieldLabel>
                                <Input type="number" {...register("registrationLimit")} />
                            </Field>
                            <Field>
                                <FieldLabel>Fee (₹)</FieldLabel>
                                <Input type="number" {...register("registrationFee")} />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Eligibility</FieldLabel>
                            <Input {...register("eligibility")} />
                        </Field>

                        <Field>
                            <FieldLabel>Tags</FieldLabel>
                            <Input {...register("tags")} placeholder="Comma separated" />
                        </Field>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </FieldGroup>
                </form>
            </SheetContent>
        </Sheet>
    )
}