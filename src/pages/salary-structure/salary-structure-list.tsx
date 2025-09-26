import Allowance from "./structures/allowance";
import { DeductionTable } from "./structures/deduction";

export default function SalaryStructureList() {
  return (
    <div className="px-6 w-full">
      <h1 className="text-2xl font-title text-foreground pt-8 mb-10">
        Salary Structure
      </h1>
      <Allowance />
      <DeductionTable />
    </div>
  );
}