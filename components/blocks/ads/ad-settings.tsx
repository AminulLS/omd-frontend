"use client";

import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Variable } from "lucide-react";
import type { AdFormData } from "@/lib/types/ads";

import { AdGeneralCard } from "@/components/blocks/ads/general-card";
import { AdClicksCard } from "@/components/blocks/ads/click-card";
import { AdDetailsCard } from "@/components/blocks/ads/ad-details-card";
import { AdButtonsCard } from "@/components/blocks/ads/ad-button-card";
import { AdDisplayCard } from "@/components/blocks/ads/display-settings-card";
import { AdPrepopCard } from "@/components/blocks/ads/prepop-card";
import { AdBoardFiltersCard } from "@/components/blocks/ads/board-filters";

interface AdSettingsTabProps {
  register: UseFormRegister<AdFormData>;
  errors: FieldErrors<AdFormData>;
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
}

const allVariables = {
  general: [
    { name: "##COMPANY##", description: "Company (if we have it, if not its the ##SEARCH##)" },
    { name: "##SEARCH##", description: "Search" },
    { name: "##SEARCH_LOWER##", description: "Search Lowercase" },
    { name: "##ZIP##", description: "Zip" },
    { name: "##STATE##", description: "State" },
    { name: "##BOARD##", description: "Board" },
    { name: "##SID##", description: "SID (Encoded Source)" },
    { name: "##ORIGIN##", description: "ORIGIN (NOT Encoded Source)" },
    { name: "##CID##", description: "CID (for CID campaigns)" },
    { name: "##SALARYRANGE_1##", description: "Salary Range 0-10 - 12-15 $" },
    { name: "##SALARYRANGE_2##", description: "Salary Range 10-20 - 22-25 $" },
    { name: "##SALARYRANGE_3##", description: "Salary Range 20-30 - 32-45 $" },
    { name: "##MONEY_1##", description: "Money 20-100" },
    { name: "##MONEY_2##", description: "Money 100-200" },
    { name: "##MONEY_3##", description: "Money 201-500" },
    { name: "##TRANSACTIONID##", description: "Generated Transaction ID" },
    { name: "##TIMESTAMP##", description: "Unix Timestamp" },
    { name: "##MONTH##", description: "Month (format: 01-012)" },
    { name: "##LINK##", description: "Embed link url" },
  ],
  prepop: [
    { name: "##FIRSTNAME##", description: 'First Name (if not available "Job seeker")' },
    { name: "##LASTNAME##", description: "Last Name" },
    { name: "##PHONE##", description: "Phone" },
    { name: "##EMAIL##", description: "Email" },
    { name: "##DOB##", description: "Date of birth" },
    { name: "##DOBYEAR##", description: "Date of birth's year" },
    { name: "##DOBMONTH##", description: "Date of birth's month" },
    { name: "##DOBDAY##", description: "Date of birth's day" },
    { name: "##VOLCID##", description: "VOLUUM CLICK ID" },
    { name: "##LISTICLEID##", description: "Listicle ID" },
    { name: "##GENDER##", description: "Gender" },
    { name: "##SSDI##", description: "SSDI" },
    { name: "##HASHUSERDATA##", description: "URL encoded Encrypted" },
    { name: "##USERDATA##", description: "URL encoded NOT Encrypted" },
    { name: "##DYNHASHDATA##", description: "OpenSSL Encrypted Data (MUST HAVE ##DYNHASHIV##)" },
    { name: "##DYNHASHIV##", description: "OpenSSL IV salt (Requires OpenSSL secret key)" },
    { name: "##MJHENCRYPT##", description: "OpenSSL Encrypt For My Job Helper" },
    { name: "##LISTICLEPIIHASH##", description: "OpenSSL Encrypt LISTICLES" },
  ],
};

export function AdSettingsTab({ register, errors, watch, setValue }: AdSettingsTabProps) {
  const [variablesModalOpen, setVariablesModalOpen] = useState(false);
  const [variableSearch, setVariableSearch] = useState("");
  const [variableCategory, setVariableCategory] = useState<"general" | "prepop">("general");
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const filteredVariables = Object.entries(allVariables).reduce((acc, [category, variables]) => {
    acc[category as keyof typeof allVariables] = variables.filter((v) => v.name.toLowerCase().includes(variableSearch.toLowerCase()) || v.description.toLowerCase().includes(variableSearch.toLowerCase()));
    return acc;
  }, {} as typeof allVariables);

  const copyVariable = async (variableName: string) => {
    try {
      await navigator.clipboard.writeText(variableName);
      setCopiedVariable(variableName);
      setTimeout(() => setCopiedVariable(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      <AdGeneralCard register={register} errors={errors} watch={watch} setValue={setValue} />
      <AdClicksCard register={register} errors={errors} watch={watch} setValue={setValue} />
      <AdDetailsCard register={register} errors={errors} watch={watch} setValue={setValue} onOpenVariablesModal={() => setVariablesModalOpen(true)} />
      <AdButtonsCard watch={watch} setValue={setValue} errors={errors} />
      <AdDisplayCard watch={watch} setValue={setValue} />
      <AdPrepopCard register={register} watch={watch} setValue={setValue} errors={errors} />
      <AdBoardFiltersCard watch={watch} setValue={setValue} errors={errors} />

      <Dialog open={variablesModalOpen} onOpenChange={setVariablesModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Variable className="h-5 w-5" />
              Available Variables
            </DialogTitle>
            <DialogDescription>Click on any variable to copy it to your clipboard. Use these variables in title, copy, and URL fields.</DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Input placeholder="Search variables..." value={variableSearch} onChange={(e) => setVariableSearch(e.target.value)} className="w-full" />
          </div>

          <Tabs value={variableCategory} onValueChange={(v) => setVariableCategory(v as "general" | "prepop")} className="mb-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="prepop">PrePop Data</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 overflow-y-auto border">
            <Table>
              <TableBody>
                {filteredVariables[variableCategory].map((variable) => (
                  <TableRow key={variable.name} className="cursor-pointer hover:bg-muted/50" onClick={() => copyVariable(variable.name)}>
                    <TableCell className="py-3">
                      <div className="flex items-start gap-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1">
                          {variable.name}
                          {copiedVariable === variable.name && <span className="ml-2 text-green-600 text-xs font-normal">✓ Copied!</span>}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVariables[variableCategory].length === 0 && (
                  <TableRow>
                    <TableCell className="text-center py-8 text-muted-foreground">No variables found matching &quot;{variableSearch}&quot;</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredVariables[variableCategory].length} of {allVariables[variableCategory].length} {variableCategory} variables
            </span>
            {copiedVariable && (
              <span className="text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied {copiedVariable}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
