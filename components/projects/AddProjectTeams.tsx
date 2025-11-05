/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteTeams } from "@/hooks/useTeam";
import { TCreateProjectSchema } from "@/schemas/project";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import MultiSelect from "../ui/multiselect";

type Props = {
  form: UseFormReturn<TCreateProjectSchema>;
};

const AddProjectTeams = ({ form }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useInfiniteTeams(searchQuery);
  const filteredTeams = data?.pages.flat() || [];

  return (
    <div>
      <FormField
        control={form.control}
        name="teams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teams</FormLabel>
            <FormControl>
              <MultiSelect
                value={field.value as string[]}
                onChange={field.onChange}
                options={filteredTeams.map((team: any) => ({
                  label: team.name,
                  value: team._id,
                }))}
                isLoading={isLoading}
                onSearchChange={setSearchQuery}
                placeholder="Select teams..."
                searchPlaceholder="Search teams..."
                emptyText="No teams found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddProjectTeams;
