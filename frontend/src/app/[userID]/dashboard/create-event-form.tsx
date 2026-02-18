"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axiosClient from "@/lib/axiosClient"
import { AxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldDescription
} from "@/components/ui/field"

// SCHEMAS
// We use strings for numbers here because HTML inputs return strings.
// We will convert them to numbers in onSubmit. This prevents Type conflicts.
const eventFormSchema = z.object({
    Name: z.string().min(3, "Event name is too short"),
    description: z.string().min(10, "Description must be detailed"),
    eligibility: z.string().min(1, "Eligibility criteria required"),
    registrationDeadline: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Deadline must be in the future",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    registrationLimit: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid number greater than 0"
    }),
    registrationFee: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a non-negative number"
    }),
    tags: z.string().optional(),
})

// Infer the type
type EventFormValues = z.infer<typeof eventFormSchema>

export function CreateEventForm({ userId }: { userId: string }) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        mode: "onChange",
        defaultValues: {
            Name: "",
            description: "",
            eligibility: "",
            registrationDeadline: "",
            startDate: "",
            endDate: "",
            registrationLimit: "0", // String default to match schema
            registrationFee: "0",   // String default to match schema
            tags: ""
        }
    })

    const onSubmit = async (data: EventFormValues) => {
        try {
            // Convert strings to numbers and arrays here before sending to backend
            const payload = {
                ...data,
                registrationLimit: Number(data.registrationLimit),
                registrationFee: Number(data.registrationFee),
                tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
                orgID: userId // Explicitly pass userId if needed by backend, though typically handled by token
            }

            const response = await axiosClient.post("/api/events/create", payload)

            toast.success("Event created successfully")
            reset()
            router.refresh()
        } catch (error) {
            console.error(error)
            let errorMessage = "An unexpected error occurred"
            
            if (error instanceof AxiosError && error.response?.data) {
                const data = error.response.data as any;
                errorMessage = data.error || data.message || errorMessage
            }
            
            toast.error(errorMessage)
        }
    }

    // Helper to return boolean or undefined for data-invalid attribute
    const isInvalid = (error: any) => error ? true : undefined;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FieldGroup>

                {/* Name Field */}
                <Field data-invalid={isInvalid(errors.Name)}>
                    <FieldLabel htmlFor="Name">Event Name</FieldLabel>
                    <Input
                        id="Name"
                        placeholder="e.g. Hackathon 2026"
                        {...register("Name")}
                    />
                    <FieldError errors={[errors.Name]} />
                </Field>

                {/* Description Field */}
                <Field data-invalid={isInvalid(errors.description)}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                        id="description"
                        placeholder="Describe the event..."
                        {...register("description")}
                    />
                    <FieldError errors={[errors.description]} />
                </Field>

                {/* Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field data-invalid={isInvalid(errors.startDate)}>
                        <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                        <Input type="datetime-local" id="startDate" {...register("startDate")} />
                        <FieldError errors={[errors.startDate]} />
                    </Field>

                    <Field data-invalid={isInvalid(errors.endDate)}>
                        <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                        <Input type="datetime-local" id="endDate" {...register("endDate")} />
                        <FieldError errors={[errors.endDate]} />
                    </Field>
                </div>

                <Field data-invalid={isInvalid(errors.registrationDeadline)}>
                    <FieldLabel htmlFor="registrationDeadline">Registration Deadline</FieldLabel>
                    <Input type="datetime-local" id="registrationDeadline" {...register("registrationDeadline")} />
                    <FieldDescription>Participants cannot register after this time.</FieldDescription>
                    <FieldError errors={[errors.registrationDeadline]} />
                </Field>

                {/* Numbers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field data-invalid={isInvalid(errors.registrationLimit)}>
                        <FieldLabel htmlFor="registrationLimit">Max Participants</FieldLabel>
                        <Input type="number" id="registrationLimit" {...register("registrationLimit")} />
                        <FieldError errors={[errors.registrationLimit]} />
                    </Field>

                    <Field data-invalid={isInvalid(errors.registrationFee)}>
                        <FieldLabel htmlFor="registrationFee">Entry Fee (₹)</FieldLabel>
                        <Input type="number" id="registrationFee" {...register("registrationFee")} />
                        <FieldError errors={[errors.registrationFee]} />
                    </Field>
                </div>

                <Field data-invalid={isInvalid(errors.eligibility)}>
                    <FieldLabel htmlFor="eligibility">Eligibility Criteria</FieldLabel>
                    <Input id="eligibility" placeholder="e.g. IIIT Students only" {...register("eligibility")} />
                    <FieldError errors={[errors.eligibility]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="tags">Tags</FieldLabel>
                    <Input id="tags" placeholder="tech, fun, coding (comma separated)" {...register("tags")} />
                </Field>

                <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting || !isValid} className="w-full md:w-auto">
                        {isSubmitting ? "Creating..." : "Create Event"}
                    </Button>
                </div>

            </FieldGroup>
        </form>
    )
}