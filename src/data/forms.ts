export interface BudgetRangeItem {
  value: string;
  label: string;
}

export const getBudgetRanges = (currency: string = 'INR'): BudgetRangeItem[] => {
  switch (currency) {
    case 'USD':
      return [
        { value: 'under-250', label: 'Under $250' },
        { value: '250-550', label: '$250 – $550' },
        { value: '550-1100', label: '$550 – $1,100' },
        { value: '1100-2200', label: '$1,100 – $2,200' },
        { value: '2200-plus', label: '$2,200+' },
        { value: 'not-sure', label: 'Not sure yet' },
      ];
    case 'EUR':
      return [
        { value: 'under-230', label: 'Under €230' },
        { value: '230-500', label: '€230 – €500' },
        { value: '500-1000', label: '€500 – €1,000' },
        { value: '1000-2000', label: '€1,000 – €2,000' },
        { value: '2000-plus', label: '€2,000+' },
        { value: 'not-sure', label: 'Not sure yet' },
      ];
    case 'AED':
      return [
        { value: 'under-900', label: 'Under 900 AED' },
        { value: '900-2000', label: '900 – 2,000 AED' },
        { value: '2000-4000', label: '2,000 – 4,000 AED' },
        { value: '4000-8000', label: '4,000 – 8,000 AED' },
        { value: '8000-plus', label: '8,000+ AED' },
        { value: 'not-sure', label: 'Not sure yet' },
      ];
    default:
      return [
        { value: 'under-20k', label: 'Under ₹20,000' },
        { value: '20k-45k', label: '₹20,000 – ₹45,000' },
        { value: '45k-90k', label: '₹45,000 – ₹90,000' },
        { value: '90k-1.8l', label: '₹90,000 – ₹1,80,000' },
        { value: '1.8l-plus', label: '₹1,80,000+' },
        { value: 'not-sure', label: 'Not sure yet' },
      ];
  }
};

// Legacy static export for backwards compatibility
export const budgetRanges = getBudgetRanges('INR');

export const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'flexible', label: 'Flexible' },
];
