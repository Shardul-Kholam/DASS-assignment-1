"use client";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import React from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {logInSchema, logInValues} from "@/app/auth/login/loginSchema";
import {zodResolver} from "@hookform/resolvers/zod";

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();

    const {register, handleSubmit, formState: {errors, isSubmitting, isValid}} = useForm<logInValues>({
        resolver: zodResolver(logInSchema), mode: "onChange"
    });

    const onSubmit = async (data: logInValues) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data),
            });

            if (response.ok) {
                const {userID} = await response.json();
                router.push(`${userID}/dashboard`);
            }

            alert(response.ok ? "Login successful!" : "Login failed. Please check your credentials and try again.");
        } catch (error) {
            console.error("Login error:", error);
        }
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-xl font-bold">Welcome to Felicity</h1>
                        <FieldDescription>
                            Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
                        </FieldDescription>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            required
                        />
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            {...register("password")}
                            id="password"
                            type="password"
                            required
                        />
                        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                    </Field>

                    <Field>
                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? "Logging In ..." : "Log In"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
