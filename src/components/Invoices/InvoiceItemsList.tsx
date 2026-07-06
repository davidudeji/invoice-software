import { InvoiceItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceItemsListProps {
    items: InvoiceItem[];
    onChange: (items: InvoiceItem[]) => void;
    currencySymbol?: string;
}

export function InvoiceItemsList({ items, onChange, currencySymbol = '$' }: InvoiceItemsListProps) {

    const handleAddItem = () => {
        const newItem: InvoiceItem = {
            id: crypto.randomUUID(),
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
            invoiceId: '',
            productId: null,
        };
        onChange([...items, newItem]);
    };

    const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        const newItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        onChange(newItems);
    };

    const handleRemoveItem = (id: string) => {
        onChange(items.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                        <div className="col-span-6 flex items-center gap-2">
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                title="Remove Item"
                            >
                                <Trash2 size={16} />
                            </button>
                            <input
                                type="text"
                                placeholder="Item description"
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={item.description}
                                onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            />
                        </div>

                        <div className="col-span-2">
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-right text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="col-span-2">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-right text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={item.unitPrice}
                                onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <div className="col-span-2 text-right font-medium text-slate-700 text-sm">
                            {currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddItem}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors mt-2 px-2 py-1 rounded-md hover:bg-indigo-50 w-fit"
            >
                <Plus size={16} />
                Add Line Item
            </button>
        </div>
    );
}
