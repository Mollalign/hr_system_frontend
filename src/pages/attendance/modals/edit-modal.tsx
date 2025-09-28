import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Attendance } from '@/types/attendace';

// Define the schema for the edit form (only checkOutTime is editable)
const editFormSchema = z.object({
    checkOutTime: z.string().min(1, { message: "Check-out time is required." }),
});

type EditAttendanceFormInput = z.infer<typeof editFormSchema>;

interface EditAttendanceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attendanceToEdit: Attendance | null;
    onSave: (id: string, newCheckOutTime: string) => Promise<void>;
    loading: boolean;
}

export const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
    open,
    onOpenChange,
    attendanceToEdit,
    onSave,
    loading,
}) => {
    const form = useForm<EditAttendanceFormInput>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            checkOutTime: "",
        },
    });

    // Populate form with existing data when modal opens
    useEffect(() => {
        if (open && attendanceToEdit) {
            // Set default check-out time to be 1 hour after check-in time
            const checkInTime = attendanceToEdit.check_in_time;
            if (checkInTime) {
                const [hours, minutes] = checkInTime.split(':').map(Number);
                const checkOutHours = hours + 1;
                const defaultTime = `${String(checkOutHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                form.reset({
                    checkOutTime: defaultTime,
                });
            } else {
                form.reset({
                    checkOutTime: "17:00", // Default to 5:00 PM if no check-in time
                });
            }
        } else if (!open) {
            form.reset({ checkOutTime: "" }); // Clear form when closed
        }
    }, [open, attendanceToEdit, form]);

    const onSubmit = async (values: EditAttendanceFormInput) => {
        if (attendanceToEdit) {
            // Validate that check-out time is after check-in time
            const checkInTime = attendanceToEdit.check_in_time;
            if (checkInTime) {
                const [checkInHours, checkInMinutes] = checkInTime.split(':').map(Number);
                const [checkOutHours, checkOutMinutes] = values.checkOutTime.split(':').map(Number);
                
                const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;
                const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;
                
                if (checkOutTotalMinutes <= checkInTotalMinutes) {
                    form.setError("checkOutTime", { 
                        message: "Check-out time must be after check-in time" 
                    });
                    return;
                }
            }
            
            // Convert time to simple HH:MM:SS format for backend
            const [hours, minutes] = values.checkOutTime.split(":").map(Number);
            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
            
            console.log("🔧 Converting time:", {
                input: values.checkOutTime,
                checkInTime: checkInTime,
                output: timeString,
                employee: attendanceToEdit.employee.full_name,
                date: attendanceToEdit.attendance_date,
                employeeId: attendanceToEdit.employee.id
            });
            
            await onSave(attendanceToEdit.id, timeString);
        }
    };

    if (!attendanceToEdit) {
        return null; // Or render a loading state/placeholder
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Check-out Time</DialogTitle>
                    <DialogDescription>
                        Add check-out time for {attendanceToEdit.employee.full_name} on {new Date(attendanceToEdit.attendance_date).toLocaleDateString()}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-4"
                    >
                        <div className="space-y-4">
                            <FormItem>
                                <FormLabel>Employee Name</FormLabel>
                                <Input value={attendanceToEdit.employee.full_name} readOnly className="bg-muted" />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <Input value={new Date(attendanceToEdit.attendance_date).toLocaleDateString()} readOnly className="bg-muted" />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Check In Time</FormLabel>
                                <Input value={attendanceToEdit.check_in_time ? attendanceToEdit.check_in_time.split(':').slice(0, 2).join(':') : '-'} readOnly className="bg-muted" />
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="checkOutTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check Out Time *</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="time" 
                                                {...field} 
                                                required 
                                                className="w-full"
                                                min={attendanceToEdit.check_in_time ? attendanceToEdit.check_in_time.split(':').slice(0, 2).join(':') : undefined}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/80" 
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Adding Check-out..." : "Add Check-out Time"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};