const filters = [
    {
      label: 'All variants',
      value: 'allVariants',
      type: 'variant',
      comparisontype: 'none',
    },
    {
      label: 'All products',
      value: 'allProducts',
      type: 'product',
      comparisontype: 'none',
    },
    {
      label: 'title',
      value: 'title',
      type: 'product',
      comparisontype: 'string',
    },
    {
      label: 'vendor',
      value: 'vendor',
      type: 'product',
      comparisontype: 'string',
    },
    {
      label: 'created_at',
      value: 'created_at',
      type: 'product',
      comparisontype: 'date',
    },
    {
      label: 'pusblished_at',
      value: 'pusblished_at',
      type: 'product',
      comparisontype: 'date',
    },
    {
      label: 'price',
      value: 'price',
      type: 'variant',
      comparisontype: 'number',
    },
    {
      label: 'description',
      value: 'description',
      type: 'product',
      comparisontype: 'string',
    },
  ];
  
  export default filters;
  