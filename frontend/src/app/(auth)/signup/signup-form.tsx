"use client";
import React from "react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {signUpSchema, signUpValues} from "@/app/(auth)/signup/signUpSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import axiosClient from "@/lib/axiosClient";
import {AxiosError} from "axios";

export function SignupForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting, isValid}
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
            const {confirmPassword, ...payload} = data;

            const response = await axiosClient.post("/api/auth/signup", payload);

            const responseData = response.data;

            alert("Account created successfully!");
            router.push("/login");

        } catch (error) {
            console.error("Signup error:", error);

            let errorMessage = "Signup failed. Please try again.";

            if (error instanceof AxiosError && error.response?.data) {
                const data = error.response.data as any;
                errorMessage = data.msg || data.message || data.error || errorMessage;
            } else if (error instanceof TypeError) {
                errorMessage = "Network error: Unable to connect to server. Please check your connection.";
            } else if (error instanceof Error) {
                errorMessage = "Error: " + error.message;
            }

            alert(errorMessage);
        }
    });

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={onFormSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-xl font-bold">Welcome to Felicity</h1>
                        <FieldDescription>
                            Already have an account? <a href="/login" className="underline">Sign in</a>
                        </FieldDescription>
                    </div>

                    <div className="flex gap-4">
                        <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Input {...register("firstName")} id="firstName"/>
                            {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Input {...register("lastName")} id="lastName"/>
                            {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="orgName">Organization Name</FieldLabel>
                        <Input {...register("orgName")} id="orgName"/>
                        {errors.orgName && <p className="text-destructive text-xs">{errors.orgName.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel>Participant Type</FieldLabel>
                        <Controller
                            control={control}
                            name="participantType"
                            render={({field}) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex items-center gap-10 mt-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="IIIT" id="IIIT"/>
                                        <FieldLabel htmlFor="IIIT" className="font-normal">IIIT</FieldLabel>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="Non-IIIT" id="Non-IIIT"/>
                                        <FieldLabel htmlFor="Non-IIIT" className="font-normal">Non-IIIT</FieldLabel>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.participantType &&
                            <p className="text-destructive text-xs">{errors.participantType.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <Input {...register("phone")} id="phone" type="tel" placeholder="+91 1234567890"/>
                        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input {...register("email")} id="email" type="email" placeholder="me@example.com"/>
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input {...register("password")} id="password" type="password"/>
                        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Re-Confirm Password</FieldLabel>
                        <Input {...register("confirmPassword")} id="confirmPassword" type="password"/>
                        {errors.confirmPassword &&
                            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
                    </Field>

                    <Button type="submit" disabled={!isValid || isSubmitting} onClick={onFormSubmit}>
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    );
}