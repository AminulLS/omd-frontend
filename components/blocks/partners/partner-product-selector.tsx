"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { ALL_PRODUCT_TYPES, productLabelMap, type ProductType } from "@/lib/types/partners";

interface PartnerProductSelectorProps {
  selectedProducts: ProductType[];
  onToggleProduct: (product: ProductType) => void;
}

export function PartnerProductSelector({ selectedProducts, onToggleProduct }: PartnerProductSelectorProps) {
  return (
    <Field>
      <FieldLabel>Products</FieldLabel>
      <FieldContent>
        <div className="flex flex-wrap gap-2">
          {ALL_PRODUCT_TYPES.map((product) => (
            <Button key={product} type="button" size="xs" variant={selectedProducts.includes(product) ? "default" : "outline"} onClick={() => onToggleProduct(product)}>
              {productLabelMap[product]}
            </Button>
          ))}
        </div>
      </FieldContent>
    </Field>
  );
}
