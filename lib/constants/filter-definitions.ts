export interface FilterDefinition {
  id: string;
  label: string;
  category: string;
}

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  { id: "usertype", label: "User Type", category: "User Demographics" },
  { id: "filter_gender", label: "Gender", category: "User Demographics" },
  { id: "age", label: "Age", category: "User Demographics" },
  { id: "prepop", label: "Prepop", category: "Traffic Type" },
  { id: "keywords", label: "Keywords", category: "Keywords" },
  { id: "sources", label: "Sources", category: "Source" },
  { id: "sources_exclude_own", label: "Exclude Own Sources", category: "Source" },
  { id: "source_wildcards", label: "Source Wildcards", category: "Source" },
  { id: "mediums", label: "Mediums", category: "Mediums" },
  { id: "companies", label: "Companies", category: "Companies" },
  { id: "locations", label: "ZIP Codes", category: "Location" },
  { id: "locations_file", label: "Locations File", category: "Location" },
  { id: "states", label: "States", category: "Location" },
  { id: "education", label: "Education", category: "User Attributes" },
  { id: "device", label: "Device", category: "User Attributes" },
  { id: "browser_language", label: "Browser Language", category: "User Attributes" },
  { id: "employment_status", label: "Employment Status", category: "User Attributes" },
  { id: "m_device", label: "Mobile Device", category: "User Attributes" },
];
