
'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { timeTableFormSchema, defaultValues } from '../schema';
import { z } from 'zod';
import { Check, ChevronsUpDown, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { teacherWithIdType } from "@/db/teachers";
import { getClassWithNameAndIdType } from '@/db/school-classes';
import { createTimeTableAction } from '../actions';

export function TimeTableForm({ teachers, Classes }: { teachers: teacherWithIdType[], Classes: getClassWithNameAndIdType[] }) {
  const form = useForm<z.infer<typeof timeTableFormSchema>>({
    resolver: zodResolver(timeTableFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof timeTableFormSchema>) => {
    startTransition(async () => {
      const result = await createTimeTableAction(values);
      toast(JSON.stringify(result.message));
    })
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl py-4 rounded-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Create Time Table</h2>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-4 p-4 rounded-lg border">
                <FormField
                  control={form.control}
                  name={`entries.${index}.day`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Day</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem className="w-36">
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem className="w-36">
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.Subject`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.teacherTeacherId`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Teacher</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[200px] overflow-hidden justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {teachers.find((t) => t.teacherId === field.value)?.teacherName || "Select Teacher"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search teacher" className="h-9" />
                            <CommandList>
                              <CommandEmpty>No teacher found</CommandEmpty>
                              {teachers.map((teacher) => (
                                <CommandItem
                                  key={teacher.teacherId}
                                  value={teacher.teacherName}
                                  onSelect={() => form.setValue(`entries.${index}.teacherTeacherId`, teacher.teacherId)}
                                >
                                  <p className="ml-8">{teacher.teacherName}</p>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      teacher.teacherId === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${index}.schoolClassSchoolClassId`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Class</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[200px] overflow-hidden justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {Classes.find((c) => c.schoolClassId === field.value)?.schoolClassId || "Select Class"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search class" className="h-9" />
                            <CommandList>
                              <CommandEmpty>No class found</CommandEmpty>
                              {Classes.map((schoolClass) => (
                                <CommandItem
                                  key={schoolClass.schoolClassId}
                                  value={schoolClass.schoolClassId}
                                  onSelect={() => form.setValue(`entries.${index}.schoolClassSchoolClassId`, schoolClass.schoolClassId)}
                                >
                                  <p className="ml-8">{schoolClass.schoolClassId}</p>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      schoolClass.schoolClassId === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="text-destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  day: '',
                  startTime: '',
                  endTime: '',
                  Subject: '',
                  teacherTeacherId: '',
                  schoolClassSchoolClassId: '',
                })
              }
              className="w-full"
            >
              Add Time Table Entry
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
