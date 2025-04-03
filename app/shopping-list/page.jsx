"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FiCheck, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

function ShoppingList() {
    const { user } = useAuth();
    const [shoppingList, setShoppingList] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newItem, setNewItem] = useState({ productName: '', quantity: 1, unit: 'items' });

    useEffect(() => {
        if (user?.householdId) {
            fetchShoppingList();
        }
    }, [user]);

    const fetchShoppingList = async () => {
        try {
            const response = await fetch(`/api/shopping-list?householdId=${user.householdId}`);
            if (!response.ok) throw new Error('Failed to fetch shopping list');
            
            const data = await response.json(); // ✅ Convert response to JSON
            console.log("Fetched Shopping List:", data); // ✅ Debugging log
            setShoppingList(data);
        } catch (error) {
            console.error('Failed to fetch shopping list:', error);
        }
    };

    const generateShoppingList = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/shopping-list', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ householdId: user.householdId })
            });

            if (!response.ok) throw new Error('Failed to generate list');

            await fetchShoppingList(); // ✅ Fetch updated data after list is generated
        } catch (error) {
            console.error('Failed to generate shopping list:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const togglePurchased = async (shoppingListId, itemId, purchased) => {
        try {
            const response = await fetch('/api/shopping-list', {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shoppingListId, itemId, purchased: !purchased })
            });

            if (!response.ok) throw new Error('Failed to update item');

            const updatedList = await response.json(); // ✅ Convert response to JSON
            setShoppingList(updatedList);
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const completeShoppingList = async () => {
        try {
            const response = await fetch(`/api/shopping-list?shoppingListId=${shoppingList._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to complete shopping list');

            setShoppingList(null);
        } catch (error) {
            console.error('Failed to complete shopping list:', error);
        }
    };

    const addManualItem = async () => {
        if (!newItem.productName.trim()) return;

        try {
            const response = await fetch('/api/shopping-list', {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shoppingListId: shoppingList._id,
                    item: {
                        productName: newItem.productName,
                        quantity: newItem.quantity,
                        unit: newItem.unit,
                        purchased: false
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to add item');

            const updatedList = await response.json(); // ✅ Convert response to JSON
            setShoppingList(updatedList);
            setNewItem({ productName: '', quantity: 1, unit: 'items' });
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                    <FiShoppingCart className="mr-2" /> Shopping List
                </h2>
                <div className="flex space-x-2">
                    {shoppingList?.items?.length > 0 && (
                        <button
                            onClick={completeShoppingList}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                        >
                            <FiCheck className="mr-1" /> Complete
                        </button>
                    )}
                    <button
                        onClick={generateShoppingList}
                        disabled={isGenerating}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center"
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>

            {shoppingList?.items?.length > 0 ? (
                <ul className="space-y-2">
                    {shoppingList.items.map((item) => (
                        <li
                            key={item._id}
                            className={`flex justify-between items-center p-2 rounded-md ${item.purchased ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <div className="flex items-center">
                                <button
                                    onClick={() => togglePurchased(shoppingList._id, item._id, item.purchased)}
                                    className={`p-1 rounded-full mr-2 ${item.purchased ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100'}`}
                                >
                                    <FiCheck />
                                </button>
                                <span className={`${item.purchased ? 'line-through text-gray-500' : ''}`}>
                                    {item.productId?.name || item.productName} - {item.quantity} {item.unit}
                                </span>
                            </div>
                            <button className="text-red-500 hover:text-red-700 p-1">
                                <FiTrash2 />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">No items in your shopping list</p>
            )}

            <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Add Custom Item</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Product name"
                        className="flex-1 px-3 py-2 border rounded-md"
                        value={newItem.productName}
                        onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    />
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, newItem.quantity - 1) })}
                            className="px-2 py-1 bg-gray-200 rounded-md"
                        >
                            <FiMinus />
                        </button>
                        <span className="px-2">{newItem.quantity}</span>
                        <button
                            onClick={() => setNewItem({ ...newItem, quantity: newItem.quantity + 1 })}
                            className="px-2 py-1 bg-gray-200 rounded-md"
                        >
                            <FiPlus />
                        </button>
                    </div>
                    <select
                        className="px-3 py-2 border rounded-md"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="items">items</option>
                    </select>
                    <button
                        onClick={addManualItem}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShoppingList;
