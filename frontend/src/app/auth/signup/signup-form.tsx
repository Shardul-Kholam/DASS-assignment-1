"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signUpSchema, signUpValues } from "@/app/auth/signup/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid }
    } = useForm<signUpValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            orgName: "",
            participantType: "IIIT",
            phone: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onFormSubmit = handleSubmit(async (data: signUpValues) => {
        try {
            const { confirmPassword, ...payload } = data;

            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                console.error("Server returned non-JSON response");
                console.error("Content-Type:", contentType);
                console.error("Status:", response.status);

                const rawText = await response.text();
                console.error("Response preview:", rawText.substring(0, 500));

                alert(
                    `Server error: Expected JSON but received ${contentType}. ` +
                    `This usually means the API route is misconfigured or doesn't exist. ` +
                    `Status: ${response.status}`
                );
                return;
            }

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.msg ||
                    responseData.message ||
                    responseData.error ||
                    "Signup failed. Please try again.";
                alert(errorMessage);
                return;
            }

            alert("Account created successfully!");
            router.push("/auth/login");

        } catch (error) {
            console.error("Signup error:", error);

            if (error instanceof TypeError && error.message.includes("fetch")) {
                alert("Network error: Unable to connect to server. Please check your connection.");
            } else {
                alert("Error: " + (error instanceof Error ? error.message : String(error)));
            }
        }
    });

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={onFormSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-xl font-bold">Welcome to Felicity</h1>
                        <FieldDescription>
                            Already have an account? <a href="/auth/login" className="underline">Sign in</a>
                        </FieldDescription>
                    </div>

                    <div className="flex gap-4">
                        <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Input {...register("firstName")} id="firstName" />
                            {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Input {...register("lastName")} id="lastName" />
                            {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="orgName">Organization Name</FieldLabel>
                        <Input {...register("orgName")} id="orgName" />
                        {errors.orgName && <p className="text-destructive text-xs">{errors.orgName.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel>Participant Type</FieldLabel>
                        <Controller
                            control={control}
                            name="participantType"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex items-center gap-10 mt-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="IIIT" id="IIIT" />
                                        <FieldLabel htmlFor="IIIT" className="font-normal">IIIT</FieldLabel>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="Non-IIIT" id="Non-IIIT" />
                                        <FieldLabel htmlFor="Non-IIIT" className="font-normal">Non-IIIT</FieldLabel>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.participantType && <p className="text-destructive text-xs">{errors.participantType.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <Input {...register("phone")} id="phone" type="tel" placeholder="+91 1234567890" />
                        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input {...register("email")} id="email" type="email" placeholder="me@example.com" />
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input {...register("password")} id="password" type="password" />
                        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Re-Confirm Password</FieldLabel>
                        <Input {...register("confirmPassword")} id="confirmPassword" type="password" />
                        {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
                    </Field>

                    <Button type="submit" disabled={!isValid || isSubmitting} onClick={onFormSubmit}>
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}