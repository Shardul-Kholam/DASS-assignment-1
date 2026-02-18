import {z} from 'zod';

export const signUpSchema = z.object({
    firstName: z.string()
        .min(1, 'firstName is required')
        .refine((firstName) => {
            const trimmedFirstName = firstName.trim();
            return trimmedFirstName.length > 0;
        }, 'First Name cannot be empty or just whitespace'),
    lastName: z.string()
        .min(1, 'lastName is required')
        .refine((lastName) => {
            const trimmedLastName = lastName.trim();
            return trimmedLastName.length > 0;
        }),
    orgName: z.string()
        .min(1, 'Organization Name is required')
        .refine((orgName) => {
            const trimmedOrgName = orgName.trim();
            return trimmedOrgName.length > 0;
        }, 'Organization Name cannot be empty or just whitespace'),
    participantType: z.enum(["IIIT", "Non-IIIT"]),
    phone: z.string().min(10, 'phone number must be at least 10 digits long'),
    email: z.email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
}).refine((data) => {
    const isIIITH = data.orgName === "International Institute of Information Technology, Hyderabad";
    if (isIIITH) {
        return data.participantType === "IIIT" && data.email.endsWith("iiit.ac.in");
    }
    return data.participantType === "Non-IIIT";
}, {
    message: "Organization, Participant Type, and Email must match (IIITH requires iiit.ac.in email)",
    path: ["participantType"],
});
export type signUpValues = z.infer<typeof signUpSchema>;