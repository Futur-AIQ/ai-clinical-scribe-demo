"use client";

import { Filter } from "lucide-react";
import { Button, Field, Menu, MenuHeading, Pill, Select } from "@/components/ui";
import { type AgeFilter, type PatientFilters, type SexFilter, type StatusFilter, hasFilters } from "@/lib/patient-list";

interface PatientFiltersMenuProps {
  filters: PatientFilters;
  onChange: (filters: PatientFilters) => void;
  /** Clears the search and the filters. */
  onReset: () => void;
}

/** Status, Sex and Age selects. Changes apply immediately. */
export function PatientFiltersMenu({ filters, onChange, onReset }: PatientFiltersMenuProps) {
  const set = (patch: Partial<PatientFilters>) => onChange({ ...filters, ...patch });
  return (
    <Menu
      kind="dialog"
      width={260}
      aria-label="Filter patients"
      trigger={(t) => (
        <Button icon={Filter} {...t}>
          Filters
          {hasFilters(filters) && (
            <Pill tone="blue" className="px-[7px] py-0">
              On
            </Pill>
          )}
        </Button>
      )}
    >
      <MenuHeading>Filter patients</MenuHeading>
      <div className="flex flex-col gap-3 px-2.5 pt-1.5 pb-2.5">
        <Field label="Status" htmlFor="pf-status">
          <Select id="pf-status" value={filters.status} onChange={(e) => set({ status: e.target.value as StatusFilter })}>
            <option value="any">Any status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </Field>
        <Field label="Sex" htmlFor="pf-sex">
          <Select id="pf-sex" value={filters.sex} onChange={(e) => set({ sex: e.target.value as SexFilter })}>
            <option value="any">Any</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </Select>
        </Field>
        <Field label="Age" htmlFor="pf-age">
          <Select id="pf-age" value={filters.age} onChange={(e) => set({ age: e.target.value as AgeFilter })}>
            <option value="any">Any age</option>
            <option value="child">Under 18</option>
            <option value="adult">18–64</option>
            <option value="senior">65 and over</option>
          </Select>
        </Field>
        <Button size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Menu>
  );
}
