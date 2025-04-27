import React, { useState, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

function ChevronUp({ className }: { className: string }) {
    return (
        <><div className={className}><FontAwesomeIcon icon={faChevronUp} /></div></>
    )
}

function ChevronDown({ className }: { className: string }) {
    return (
        <><div className={className}><FontAwesomeIcon icon={faChevronDown} /></div></>
    )
}

function X({ className }: { className: string }) {
    return (
        <><div className={className}><FontAwesomeIcon icon={faXmark} /></div></>
    )
}

export interface Item {
    id: string;
    name: string;
    isSelected: boolean;
}

function newUuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

const initItems: Item[] = [
    { id: newUuidv4(), name: 'Education \u2606', isSelected: false },
    { id: newUuidv4(), name: 'Art \uF3A8', isSelected: true },
    { id: newUuidv4(), name: 'Sport \u26BD', isSelected: true },
    { id: newUuidv4(), name: 'Games \u26F9', isSelected: true },
    { id: newUuidv4(), name: 'Health \u260A', isSelected: true },
];

interface ItemSelectorProps {
    onItemSelect?: (item: Item) => void;
    className?: string;
}

const MultiSelectDropDown: React.FC<ItemSelectorProps> = ({
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [items, setItems] = useState<Item[]>(initItems);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const newItemInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && newItemInputRef.current) {
            newItemInputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const addNewItem = (item: Item) => {
        setItems(i => [...i, item]);
    };

    const handleAddItemKeyDown = async (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && newItemInputRef.current) {
            let value = newItemInputRef.current.value;
            console.log('handleAddItemKeyDown: ', value);
            addNewItem({ id: newUuidv4(), isSelected: false, name: value });
            clearSearch();
        }
    }

    const handleAddItemChange = async (input: string): Promise<void> => {
        if (input.length > 0) {
            setShowAddItem(true);
        } else {
            setShowAddItem(false);
        }
    }

    const handleToggleSelect = async (event: React.MouseEvent, itemId: string, currentStatus: boolean) => {
        event.stopPropagation();

        try {
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, isSelected: !currentStatus }
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const clearSearch = () => {
        if (newItemInputRef.current) {
            newItemInputRef.current.value = '';
            newItemInputRef.current.focus();

            setShowAddItem(false);
        }
    };

    return (
        <>
            <div className='dropdown'>
                <div ref={dropdownRef} className={'dropdown-selector ' + className}>
                    <div className='selector-container'>
                        <div className="search-container">
                            <input ref={newItemInputRef} type="text" placeholder="Add Item..." onKeyDown={handleAddItemKeyDown} onChange={(e) => handleAddItemChange(e.target.value)} //value={searchQuery} onChange={handleAddItemChange} //setSearchQuery(e.target.value)}
                                className="input" />
                            {showAddItem && (
                                <button type='button' title='Clear' onClick={clearSearch} className="selector-button">
                                    <X className="selector-icon" />
                                </button>)
                            }
                            <button onClick={handleToggleDropdown} className="selector-button">
                                {isOpen ? (<ChevronUp className="selector-icon" />) : (<ChevronDown className="selector-icon" />)}
                            </button>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="dropdown-expanded">
                            <>
                                {items.length > 0 && (
                                    <div className="section selected-section">
                                        {items.map(item => (
                                            <div key={item.id} className="item"
                                                onClick={(e) => handleToggleSelect(e, item.id, item.isSelected)}>
                                                <div className=""><p>{item.name.toUpperCase()}</p></div>
                                                <div className='selector-button' title='Toggle select'>
                                                    {item.isSelected ? <div  className='selector-icon'><FontAwesomeIcon icon={faCheck} /></div> : <span />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default MultiSelectDropDown;