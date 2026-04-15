import React from "react";
import { Search, SlidersHorizontal, MapPin, DollarSign, Home, CheckCircle } from "lucide-react";

interface SearchFiltersProps {
    onSearch: (filters: any) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
    const [filters, setFilters] = React.useState({
        location: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
        verifiedOnly: true,
        hasVideo: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        const nextFilters = { ...filters, [name]: val };
        setFilters(nextFilters);
        onSearch(nextFilters);
    };

    const clearFilters = () => {
        const reset = {
            location: "",
            minPrice: "",
            maxPrice: "",
            propertyType: "",
            verifiedOnly: true,
            hasVideo: false,
        };
        setFilters(reset);
        onSearch(reset);
    };

    return (
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Search Input */}
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-secondary transition-colors" />
                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleChange}
                        placeholder="Search by location (e.g. Asaba, GRA, Okpanam...)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/20 placeholder:text-sm"
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button
                        className="flex-1 lg:flex-none bg-primary text-white border border-white/10 px-8 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white hover:text-primary transition-all shadow-xl"
                        onClick={() => onSearch(filters)}
                    >
                        Find Properties
                    </button>
                    <button
                        onClick={clearFilters}
                        className="bg-white/5 text-white/40 hover:text-white p-5 rounded-2xl border border-white/10 transition-all font-bold uppercase tracking-widest text-[10px]"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-white/5">
                {/* Price Range */}
                <div className="space-y-3">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-1 flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Price Range (₦)
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="Min"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-secondary transition-all"
                        />
                        <span className="text-white/20">–</span>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="Max"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-1 flex items-center gap-2">
                        <Home className="w-3 h-3" /> Property Type
                    </label>
                    <select
                        name="propertyType"
                        value={filters.propertyType}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-secondary transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-primary">All Types</option>
                        <option value="house" className="bg-primary">House</option>
                        <option value="apartment" className="bg-primary">Apartment</option>
                        <option value="land" className="bg-primary">Land</option>
                    </select>
                </div>

                {/* Verified Toggle */}
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="verifiedOnly"
                                checked={filters.verifiedOnly}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${filters.verifiedOnly ? 'bg-secondary' : 'bg-white/10'}`} />
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${filters.verifiedOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-[10px] text-white/60 group-hover:text-white uppercase tracking-widest font-bold transition-colors flex items-center gap-2">
                            Verified Agents <CheckCircle className={`w-3 h-3 ${filters.verifiedOnly ? 'text-secondary' : 'text-white/20'}`} />
                        </span>
                    </label>
                </div>

                {/* Video Toggle */}
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="hasVideo"
                                checked={filters.hasVideo}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${filters.hasVideo ? 'bg-secondary' : 'bg-white/10'}`} />
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${filters.hasVideo ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-[10px] text-white/60 group-hover:text-white uppercase tracking-widest font-bold transition-colors">
                            Has Video Tour
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};
