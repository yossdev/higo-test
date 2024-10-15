"use client";

import { cn } from "@/lib/utils";
import { PersonIcon, SymbolIcon } from "@radix-ui/react-icons";
import { Plus, Trash } from "lucide-react";

export function Controls({
  deleteCustomer,
  addNewCustomer,
  updateCustomer,
  controlDisabled,
}) {
  const className = cn(
    "px-3 py-1.5 rounded border text-center",
    controlDisabled ? "cursor-not-allowed bg-gray-300" : ""
  );
  return (
    <div className="flex justify-between gap-7">
      <button
        type="button"
        className={className}
        onClick={addNewCustomer}
        disabled={controlDisabled}
      >
        <div className="flex items-center justify-between">
          <Plus width={18} height={18} color="blue" />
          <PersonIcon width={23} height={23} />
        </div>
      </button>
      <button
        type="button"
        className={className}
        onClick={deleteCustomer}
        disabled={controlDisabled}
      >
        <Trash width={20} height={20} color="red" />
      </button>
      <button
        type="button"
        className={className}
        onClick={updateCustomer}
        disabled={controlDisabled}
      >
        <div className="flex items-center justify-between">
          <SymbolIcon width={17} height={17} color="green" />
          <PersonIcon width={23} height={23} />
        </div>
      </button>
    </div>
  );
}
