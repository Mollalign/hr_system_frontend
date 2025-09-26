"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2 } from "lucide-react"
import type { TaxBracket, OtherDeduction, DeductionTypeRequest, OtherDeductionData, PensionData, DeductionApiRequest} from "@/types/deduction"
import { useUpdateDeduction } from "@/hooks/useDeduction"

interface EditDeductionFormProps {
  onOpenChange: (open: boolean) => void
  deductionData: DeductionTypeRequest // Added prop to receive existing deduction data
  onUpdate?: (data: DeductionTypeRequest) => void // Added update callback
}

type DeductionType = "Tax" | "Pension" | "Other"

export function EditDeductionForm({ onOpenChange, deductionData, onUpdate }: EditDeductionFormProps) {
  console.log("EditDeductionForm received data:", deductionData)
  const [deductionType] = useState<DeductionType>(deductionData.type as DeductionType)
  const [isActive, setIsActive] = useState(deductionData.is_active ?? true)
  const [description] = useState(deductionData.description || "")
  const {mutate: updateDeduction, isPending: isUpdating} = useUpdateDeduction()
  
  // Tax-specific state - initialize with existing data
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(() => {
    if (deductionData.type === "Tax" && Array.isArray(deductionData.data)) {
      return deductionData.data.map((item) => {
        const taxItem = item as TaxBracket;
        return {
          name: taxItem.name || "",
          min_salary: taxItem.min_salary || 0,
          max_salary: taxItem.max_salary || 0,
          rate: taxItem.rate || 0,
          deduction: taxItem.deduction || 0,
        };
      })
    }
    return [{ name: "", min_salary: 0, max_salary: 0, rate: 0, deduction: 0 }]
  })

  // Pension-specific state - initialize with existing data
  const [pensionPercentage, setPensionPercentage] = useState<number>(() => {
    if (deductionData.type === "Pension" && Array.isArray(deductionData.data) && deductionData.data[0]) {
      const pensionData = deductionData.data[0] as PensionData;
      return pensionData.percentage || 0
    }
    return 0
  })


  // Other-specific state - initialize with existing data
  const [otherDeductions, setOtherDeductions] = useState<OtherDeduction[]>(() => {
    if (deductionData.type === "Other" && Array.isArray(deductionData.data)) {
      return deductionData.data.map((item) => {
        const otherItem = item as OtherDeductionData;
        return {
          name: otherItem.name || "",
          type: otherItem.type || "fixed",
          percentage: otherItem.percentage || 0,
          amount: otherItem.amount || 0,
          description: otherItem.description || "",
        }
      })
    }
    return [{ name: "", type: "fixed", percentage: 0, amount: 0, description: "" }]
  })

  const addTaxBracket = () => {
    setTaxBrackets([...taxBrackets, { name: "", min_salary: 0, max_salary: 0, rate: 0, deduction: 0 }])
  }

  const removeTaxBracket = (index: number) => {
    setTaxBrackets(taxBrackets.filter((_, i) => i !== index))
  }

  const updateTaxBracket = (index: number, field: keyof TaxBracket, value: any) => {
    const updated = [...taxBrackets]
    updated[index] = { ...updated[index], [field]: value }
    setTaxBrackets(updated)
  }

  const addOtherDeduction = () => {
    setOtherDeductions([...otherDeductions, { name: "", type: "fixed", percentage: 0, amount: 0, description: "" }])
  }

  const removeOtherDeduction = (index: number) => {
    setOtherDeductions(otherDeductions.filter((_, i) => i !== index))
  }

  const updateOtherDeduction = (index: number, field: keyof OtherDeduction, value: any) => {
    const updated = [...otherDeductions]
    updated[index] = { ...updated[index], [field]: value }
    setOtherDeductions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    let dataObjects: any = [];
  
    if (deductionType === "Tax") {
      const taxData = Array.isArray(deductionData.data) ? deductionData.data as TaxBracket[] : [];
      dataObjects = taxBrackets.map((bracket, idx) => {
        const existingBracket = taxData[idx];
        return {
          id: existingBracket?.id, // child id
          name: bracket.name,
          min_salary: bracket.min_salary,
          max_salary: bracket.max_salary,
          rate: bracket.rate,
          deduction: bracket.deduction,
        };
      });
    } 
    else if (deductionType === "Pension") {
      const pensionData = Array.isArray(deductionData.data) ? deductionData.data as PensionData[] : [];
      dataObjects = [{
        id: pensionData[0]?.id, // child id
        percentage: pensionPercentage, 
      }];
    } 
    else if (deductionType === "Other") {
      const otherData = Array.isArray(deductionData.data) ? deductionData.data as OtherDeductionData[] : [];
      dataObjects = otherDeductions.map((ded, idx) => {
        const existingDeduction = otherData[idx];
        return {
          id: existingDeduction?.id, // child id
          name: ded.name,
          type: ded.type,
          percentage: ded.percentage,
          amount: ded.amount,
          description: ded.description,
          is_active: true,
        };
      });
    }
  
    // Send data as objects (not JSON strings)
    const requestBody: DeductionApiRequest = {
      type: deductionType,
      data: dataObjects,
      is_active: isActive,
    };
  
    console.log("Update Request Body:", requestBody);
  
    try {
      updateDeduction({id: deductionData.id, data: requestBody}, {
        onSuccess: () => {
          onOpenChange(false);
          if (onUpdate) {
            // Create the updated deduction data for the parent component
            const updatedDeduction: DeductionTypeRequest = {
              id: deductionData.id,
              type: deductionType,
              data: dataObjects,
              is_active: isActive,
              description: description,
            };
            onUpdate(updatedDeduction);
          }
        }
      });
    } catch (error) {
      console.error("Error updating deduction:", error);
    }
  };
  

  const handleCancel = () => {
    onOpenChange(false)
  }

  const renderTaxForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Tax Brackets</Label>
        <Button type="button" onClick={addTaxBracket} size="sm" variant="outline">
          Add Bracket
        </Button>
      </div>

      {taxBrackets.map((bracket, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="py-2" htmlFor={`bracket-name-${index}`}>
                Bracket Name
              </Label>
              <Input
                id={`bracket-name-${index}`}
                value={bracket.name}
                onChange={(e) => updateTaxBracket(index, "name", e.target.value)}
                placeholder="e.g., Lower Income Bracket"
              />
            </div>

            <div className="flex items-end">
              {taxBrackets.length > 1 && (
                <Button type="button" onClick={() => removeTaxBracket(index)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Label className="py-2" htmlFor={`min-salary-${index}`}>
                Min Salary
              </Label>
              <Input
                id={`min-salary-${index}`}
                type="number"
                value={bracket.min_salary}
                onChange={(e) => updateTaxBracket(index, "min_salary", Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label className="py-2" htmlFor={`max-salary-${index}`}>
                Max Salary
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`max-salary-${index}`}
                  type="number"
                  value={bracket.max_salary === "UNLIMITED" ? "" : bracket.max_salary}
                  onChange={(e) => updateTaxBracket(index, "max_salary", Number(e.target.value) || 0)}
                  disabled={bracket.max_salary === "UNLIMITED"}
                />
                <Button
                  type="button"
                  onClick={() =>
                    updateTaxBracket(index, "max_salary", bracket.max_salary === "UNLIMITED" ? 0 : "UNLIMITED")
                  }
                  variant="outline"
                  size="sm"
                >
                  {bracket.max_salary === "UNLIMITED" ? "Set Limit" : "Unlimited"}
                </Button>
              </div>
            </div>

            <div>
              <Label className="py-2" htmlFor={`rate-${index}`}>
                Tax Rate (%)
              </Label>
              <Input
                id={`rate-${index}`}
                type="number"
                step="0.1"
                value={bracket.rate}
                onChange={(e) => updateTaxBracket(index, "rate", Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label className="py-2" htmlFor={`deduction-${index}`}>
                Deduction Amount
              </Label>
              <Input
                id={`deduction-${index}`}
                type="number"
                step="0.01"
                value={bracket.deduction}
                onChange={(e) => updateTaxBracket(index, "deduction", Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
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
          onChange={(e) => setPensionPercentage(Number.parseFloat(e.target.value) || 0)}
          placeholder="e.g., 7.0"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Percentage of salary to be deducted for pension contributions
        </p>
      </div>
    </div>
  )

  const renderOtherForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Other Deductions</Label>
        <Button type="button" onClick={addOtherDeduction} size="sm" variant="outline">
          Add Deduction
        </Button>
      </div>

      {otherDeductions.map((deduction, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Deduction {index + 1}</Label>
              {otherDeductions.length > 1 && (
                <Button type="button" onClick={() => removeOtherDeduction(index)} size="sm" variant="destructive">
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
                  onChange={(e) => updateOtherDeduction(index, "name", e.target.value)}
                  placeholder="e.g., Health Insurance Premium"
                />
              </div>

              <div>
                <Label className="py-2">Deduction Type</Label>
                <RadioGroup
                  value={deduction.type}
                  onValueChange={(value: string) => updateOtherDeduction(index, "type", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id={`fixed-${index}`} />
                    <Label className="py-2" htmlFor={`fixed-${index}`}>
                      Fixed Amount
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id={`percentage-${index}`} />
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
                    onChange={(e) => updateOtherDeduction(index, "amount", Number.parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => updateOtherDeduction(index, "percentage", Number.parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => updateOtherDeduction(index, "description", e.target.value)}
                  placeholder="Brief description of this deduction"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="bg-muted/50 p-3 rounded-lg">
        <Label className="text-sm font-medium text-muted-foreground">Editing {deductionType} Deduction</Label>
      </div>

      {deductionType === "Tax" && renderTaxForm()}
      {deductionType === "Pension" && renderPensionForm()}
      {deductionType === "Other" && renderOtherForm()}

      {deductionType !== "Pension" && deductionType !== "Tax" && (
        <div className="flex items-center space-x-2">
          <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="is-active">Active</Label>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent" disabled={isUpdating}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isUpdating}>
          Update Deduction
        </Button>
      </div>
    </form>
  )
}
