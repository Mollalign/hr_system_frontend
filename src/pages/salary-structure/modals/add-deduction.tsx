"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus } from "lucide-react";
import { useCreateDeduction } from "@/hooks/useDeduction";
import type {
  TaxBracket,
  OtherDeduction,
  DeductionTypeRequest,
} from "@/types/deduction";

interface AddDeductionFormProps {
  onOpenChange: (open: boolean) => void;
}

type DeductionType = "Tax" | "Pension" | "Other";

export function AddDeductionForm({ onOpenChange }: AddDeductionFormProps) {
  const [deductionType, setDeductionType] = useState<DeductionType>();
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const { mutate: createDeduction, isPending: isCreating } =
    useCreateDeduction();
  // Tax-specific state
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([
    { name: "", min_salary: 0, max_salary: 0, rate: 0, deduction: 0 },
  ]);

  // Pension-specific state
  const [pensionPercentage, setPensionPercentage] = useState<number>(0);

  // Other-specific state
  const [otherDeductions, setOtherDeductions] = useState<OtherDeduction[]>([
    { name: "", type: "fixed", percentage: 0, amount: 0, description: "" },
  ]);

  const addTaxBracket = () => {
    setTaxBrackets([
      ...taxBrackets,
      { name: "", min_salary: 0, max_salary: 0, rate: 0, deduction: 0 },
    ]);
  };

  const removeTaxBracket = (index: number) => {
    setTaxBrackets(taxBrackets.filter((_, i) => i !== index));
  };

  const updateTaxBracket = (
    index: number,
    field: keyof TaxBracket,
    value: any
  ) => {
    const updated = [...taxBrackets];
    updated[index] = { ...updated[index], [field]: value };
    setTaxBrackets(updated);
  };

  const addOtherDeduction = () => {
    setOtherDeductions([
      ...otherDeductions,
      { name: "", type: "fixed", percentage: 0, amount: 0, description: "" },
    ]);
  };

  const removeOtherDeduction = (index: number) => {
    setOtherDeductions(otherDeductions.filter((_, i) => i !== index));
  };

  const updateOtherDeduction = (
    index: number,
    field: keyof OtherDeduction,
    value: any
  ) => {
    const updated = [...otherDeductions];
    updated[index] = { ...updated[index], [field]: value };
    setOtherDeductions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let data: any[] = [];

    if (deductionType === "Tax") {
      // Send tax brackets as objects
      data = taxBrackets.map((bracket) => ({
        name: bracket.name,
        min_salary: bracket.min_salary,
        max_salary:
          bracket.max_salary === "UNLIMITED" ? "UNLIMITED" : bracket.max_salary,
        rate: bracket.rate,
        deduction: bracket.deduction,
      }));
    } else if (deductionType === "Pension") {
      data = [{ percentage: pensionPercentage }];
    } else if (deductionType === "Other") {
      data = otherDeductions.map((deduction) => ({
        name: deduction.name,
        type: deduction.type,
        percentage: deduction.percentage,
        amount: deduction.amount,
        description: deduction.description,
        is_active: true,
      }));
    }

    const requestBody = {
      type: deductionType,
      data: data,
      is_active: isActive,
      description: description,
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("Request Body Type:", typeof requestBody);
    console.log("Request Body Data Type:", typeof requestBody.data);
    console.log("Request Body Data:", requestBody.data);

    // Here you would make the API call to your backend
    createDeduction(requestBody as DeductionTypeRequest);
    // Close the modal after successful submission
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };
  const renderTaxForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Tax Brackets</Label>
        {/* <Button
          type="button"
          onClick={addTaxBracket}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bracket
        </Button> */}
      </div>

      {taxBrackets.map((bracket, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bracket Name */}
            <div>
              <Label className="py-2" htmlFor={`bracket-name-${index}`}>
                Bracket Name
              </Label>
              <Input
                id={`bracket-name-${index}`}
                value={bracket.name}
                onChange={(e) =>
                  updateTaxBracket(index, "name", e.target.value)
                }
                placeholder="e.g., Lower Income Bracket"
              />
            </div>

            {/* Remove Bracket */}
            <div className="flex items-end">
              {taxBrackets.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTaxBracket(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Min Salary */}
            <div>
              <Label className="py-2" htmlFor={`min-salary-${index}`}>
                Min Salary
              </Label>
              <Input
                id={`min-salary-${index}`}
                type="number"
                value={bracket.min_salary}
                onChange={(e) =>
                  updateTaxBracket(
                    index,
                    "min_salary",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>

            {/* Max Salary */}
            <div>
              <Label className="py-2" htmlFor={`max-salary-${index}`}>
                Max Salary
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`max-salary-${index}`}
                  type="number"
                  value={
                    bracket.max_salary === "UNLIMITED" ? "" : bracket.max_salary
                  }
                  onChange={(e) =>
                    updateTaxBracket(
                      index,
                      "max_salary",
                      Number(e.target.value) || 0
                    )
                  }
                  disabled={bracket.max_salary === "UNLIMITED"}
                />
                <Button
                  type="button"
                  onClick={() =>
                    updateTaxBracket(
                      index,
                      "max_salary",
                      bracket.max_salary === "UNLIMITED" ? 0 : "UNLIMITED"
                    )
                  }
                  variant="outline"
                  size="sm"
                >
                  {bracket.max_salary === "UNLIMITED"
                    ? "Set Limit"
                    : "Unlimited"}
                </Button>
              </div>
            </div>

            {/* Rate */}
            <div>
              <Label className="py-2" htmlFor={`rate-${index}`}>
                Tax Rate (%)
              </Label>
              <Input
                id={`rate-${index}`}
                type="number"
                step="0.1"
                value={bracket.rate}
                onChange={(e) =>
                  updateTaxBracket(index, "rate", Number(e.target.value) || 0)
                }
              />
            </div>

            {/* Deduction Amount */}
            <div>
              <Label className="py-2" htmlFor={`deduction-${index}`}>
                Deduction Amount
              </Label>
              <Input
                id={`deduction-${index}`}
                type="number"
                step="0.01"
                value={bracket.deduction}
                onChange={(e) =>
                  updateTaxBracket(
                    index,
                    "deduction",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderPensionForm = () => (
    <div className="space-y-4">
      <div>
        <Label className="py-2" htmlFor="pension-percentage">
          Pension Contribution Percentage
        </Label>
        <Input
          id="pension-percentage"
          type="number"
          step="0.1"
          value={pensionPercentage}
          onChange={(e) =>
            setPensionPercentage(Number.parseFloat(e.target.value) || 0)
          }
          placeholder="e.g., 7.0"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Percentage of salary to be deducted for pension contributions
        </p>
      </div>
    </div>
  );

  const renderOtherForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Other Deductions</Label>
        {/* <Button
          type="button"
          onClick={addOtherDeduction}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deduction
        </Button> */}
      </div>

      {otherDeductions.map((deduction, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Deduction {index + 1}
              </Label>
              {otherDeductions.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeOtherDeduction(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="py-2" htmlFor={`deduction-name-${index}`}>
                  Name
                </Label>
                <Input
                  id={`deduction-name-${index}`}
                  value={deduction.name}
                  onChange={(e) =>
                    updateOtherDeduction(index, "name", e.target.value)
                  }
                  placeholder="e.g., Health Insurance Premium"
                />
              </div>

              <div>
                <Label className="py-2">Deduction Type</Label>
                <RadioGroup
                  value={deduction.type}
                  onValueChange={(value: string) =>
                    updateOtherDeduction(index, "type", value)
                  }
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id={`fixed-${index}`} />
                    <Label className="py-2" htmlFor={`fixed-${index}`}>
                      Fixed Amount
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="percentage"
                      id={`percentage-${index}`}
                    />
                    <Label className="py-2" htmlFor={`percentage-${index}`}>
                      Percentage
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {deduction.type === "fixed" ? (
                <div>
                  <Label className="py-2" htmlFor={`amount-${index}`}>
                    Amount
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    step="0.01"
                    value={deduction.amount}
                    onChange={(e) =>
                      updateOtherDeduction(
                        index,
                        "amount",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              ) : (
                <div>
                  <Label className="py-2" htmlFor={`percentage-${index}`}>
                    Percentage
                  </Label>
                  <Input
                    id={`percentage-${index}`}
                    type="number"
                    step="0.1"
                    value={deduction.percentage}
                    onChange={(e) =>
                      updateOtherDeduction(
                        index,
                        "percentage",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <Label className="py-2" htmlFor={`description-${index}`}>
                  Description
                </Label>
                <Textarea
                  id={`description-${index}`}
                  value={deduction.description}
                  onChange={(e) =>
                    updateOtherDeduction(index, "description", e.target.value)
                  }
                  placeholder="Brief description of this deduction"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div>
        <Label className="py-2" htmlFor="deduction-type">
          Deduction Type
        </Label>
        <Select
          value={deductionType}
          onValueChange={(value: DeductionType) => setDeductionType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select deduction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tax">Tax</SelectItem>
            <SelectItem value="Pension">Pension</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* <div>
        <Label className="py-2" htmlFor="description">General Description</Label>
        <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this deduction category"
            rows={3}
        />
        </div> */}

      {deductionType === "Tax" && renderTaxForm()}
      {deductionType === "Pension" && renderPensionForm()}
      {deductionType === "Other" && renderOtherForm()}
      {deductionType !== "Pension" && deductionType !== "Tax" && (
        <div className="flex items-center space-x-2">
          <Switch
            id="is-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="is-active">Active</Label>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!deductionType || isCreating}
        >
          {isCreating ? "Creating..." : "Create Deduction"}
        </Button>
      </div>
    </form>
  );
}
