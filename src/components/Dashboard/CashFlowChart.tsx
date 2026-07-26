"use client";

import { useInvoiceStore } from "@/lib/store";

export function CashFlowChart() {
    // Mock data for visual consistency if store doesn't have history
    const data = [
        { month: 'Aug', value: 35 },
        { month: 'Sep', value: 60 },
        { month: 'Oct', value: 45 },
        { month: 'Nov', value: 80 },
        { month: 'Dec', value: 55 },
        { month: 'Jan', value: 90 },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6">Cash Flow</h3>

            <div className="flex-1 flex items-end justify-between gap-3 min-h-[160px]">
                {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
                        <div className="w-full bg-slate-50 rounded-t-lg relative overflow-hidden flex-1 flex items-end">
                            <div
                                className="w-full rounded-t-lg transition-all duration-700 ease-out"
                                style={{
                                  height: `${item.value}%`,
                                  background: "#1469F8",
                                  opacity: 0.8 + i * 0.03,
                                }}
                            />
                        </div>
                        <p className="text-xs text-center text-slate-500 font-medium">
                            {item.month}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
