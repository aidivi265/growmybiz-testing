export interface BudgetRangeItem {
  value: string;
  label: string;
}

export const getBudgetRanges = (): BudgetRangeItem[] => {
  return [
    { value: 'under-20k', label: 'Under ₹20,000' },
    { value: '20k-45k', label: '₹20,000 – ₹45,000' },
    { value: '45k-90k', label: '₹45,000 – ₹90,000' },
    { value: '90k-1.8l', label: '₹90,000 – ₹1,80,000' },
    { value: '1.8l-plus', label: '₹1,80,000+' },
    { value: 'not-sure', label: 'Not sure yet' },
  ];
};

// Static export for forms
export const budgetRanges = getBudgetRanges();

export const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'flexible', label: 'Flexible' },
];
