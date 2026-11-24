import React, { useState, useMemo } from 'react';
import {
  Search,
  PhoneCall,
  MessageSquare,
  Globe,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { COUNTRY_HELPLINES, CountryHelpline, detectUserCountry } from '../data/countryHelplines';

export const CountryServicesSearch: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const detectedCountry = useMemo(() => detectUserCountry(), []);

  const regions = ['All', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Africa & Middle East', 'Global'];

  const filteredHelplines = useMemo(() => {
    return COUNTRY_HELPLINES.filter((item) => {
      const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.country.toLowerCase().includes(query) ||
        item.primaryName.toLowerCase().includes(query) ||
        item.primaryNumber.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.languages.some((lang) => lang.toLowerCase().includes(query));

      return matchesRegion && matchesSearch;
    });
  }, [searchTerm, selectedRegion]);

  return (
    <div
      className={`a4-sheet-card p-6 sm:p-8 space-y-6 ${
        isDark ? 'bg-[#191217] border-[#34222D]' : 'bg-[#FFFFFF] border-[#E8DDD0]'
      }`}
    >
      {/* Section Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-[#2C1C26]' : 'border-[#EAE1D5]'
        }`}
      >
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono-clean ${
              isDark ? 'text-[#E89382]' : 'text-[#B84E39]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Country-Wise Crisis Helplines & Mental Health Support</span>
          </div>
          <h3
            className={`font-cormorant text-2xl sm:text-3xl font-bold ${
              isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
            }`}
          >
            Find Immediate Help in Your Country
          </h3>
        </div>

        {/* Detected Location Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
            isDark
              ? 'bg-[#261722] border-[#442A39] text-[#F0C9BD]'
              : 'bg-[#FAF2EC] border-[#E8D6C6] text-[#A64632]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#E89382]" />
          <span>Detected Region: <strong>{detectedCountry.flag} {detectedCountry.country}</strong></span>
        </div>
      </div>

      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#C5B4AC]' : 'text-[#64564E]'}`}>
        Confidential, compassionate mental health counselors and suicide crisis hotlines are standing by 24/7 across the globe. You are never a burden, and reaching out is an act of profound courage.
      </p>

      {/* Search Input and Region Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8B83]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by country (e.g. United States, India, UK, Australia), language, or service..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border transition focus:outline-hidden ${
              isDark
                ? 'bg-[#150E13] border-[#382330] text-[#EDE2DC] focus:border-[#E89382]'
                : 'bg-[#FAF6F0] border-[#DDD0C0] text-[#28211E] focus:border-[#E07A5F]'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1 rounded-full whitespace-nowrap border transition ${
                selectedRegion === region
                  ? isDark
                    ? 'bg-[#E89382] text-[#160E12] font-semibold border-[#E89382] shadow-xs'
                    : 'bg-[#E89382] text-white font-semibold border-[#E89382] shadow-xs'
                  : isDark
                  ? 'bg-[#20151C] border-[#36222E] text-[#A6948C] hover:bg-[#2A1B24]'
                  : 'bg-[#FAF5EE] border-[#E2D6C8] text-[#6D5E56] hover:bg-[#F2ECE3]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {filteredHelplines.map((item) => {
          const isUserMatch = item.id === detectedCountry.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border transition-all duration-300 space-y-3 relative overflow-hidden ${
                isUserMatch
                  ? isDark
                    ? 'bg-[#241720] border-[#E89382]/60 shadow-[0_0_20px_rgba(232,147,130,0.12)]'
                    : 'bg-[#FCF7F3] border-[#E89382] shadow-sm'
                  : isDark
                  ? 'bg-[#1D141A] border-[#34222D] hover:border-[#4D3042]'
                  : 'bg-[#FAF6F0] border-[#E5DAD0] hover:border-[#D5C2B4]'
              }`}
            >
              {isUserMatch && (
                <div
                  className={`absolute top-0 right-0 px-2.5 py-0.5 text-[9px] font-mono-clean uppercase tracking-wider rounded-bl-xl font-semibold ${
                    isDark ? 'bg-[#E89382] text-[#160E12]' : 'bg-[#E89382] text-white'
                  }`}
                >
                  Your Location
                </div>
              )}

              {/* Country & Flag Title */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl select-none">{item.flag}</span>
                  <div>
                    <h4
                      className={`font-cormorant text-lg sm:text-xl font-bold leading-tight ${
                        isDark ? 'text-[#FAF4F0]' : 'text-[#28211E]'
                      }`}
                    >
                      {item.country}
                    </h4>
                    <span className={`text-[10px] font-mono-clean ${isDark ? 'text-[#9E8B83]' : 'text-[#87786E]'}`}>
                      {item.region}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {item.is24x7 && (
                    <span className="flex items-center gap-1 text-[10px] text-[#559E74] font-mono-clean font-semibold">
                      <Clock className="w-3 h-3" /> 24/7 Support
                    </span>
                  )}
                  {item.freeCall && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono-clean ${
                      isDark ? 'bg-[#29362D] text-[#86C29D]' : 'bg-[#EBF7EF] text-[#246A3D]'
                    }`}>
                      Toll-Free
                    </span>
                  )}
                </div>
              </div>

              {/* Primary Hotline Number Call Box */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isDark ? 'bg-[#150E13] border-[#311E2A]' : 'bg-[#FFFFFF] border-[#E8DFD4]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-mono-clean text-[#E89382] font-semibold">
                    {item.primaryName}
                  </div>
                  <div
                    className={`font-mono-clean text-base sm:text-lg font-bold tracking-tight ${
                      isDark ? 'text-[#FFF2EB]' : 'text-[#1E1612]'
                    }`}
                  >
                    {item.primaryNumber}
                  </div>
                </div>

                {item.primaryNumber !== 'Visit Website' && (
                  <a
                    href={`tel:${item.primaryNumber.replace(/[^0-9+]/g, '')}`}
                    className="shrink-0 px-3 py-1.5 btn-youmatter-primary text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                )}
              </div>

              {/* Text option if available */}
              {item.textOption && (
                <div
                  className={`text-xs p-2 rounded-xl border flex items-center gap-2 ${
                    isDark
                      ? 'bg-[#191116] border-[#2E1B27] text-[#D8C7BF]'
                      : 'bg-[#F9F4EE] border-[#ECE2D6] text-[#4A3D36]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#E4B074] shrink-0" />
                  <span className="text-[11px]">{item.textOption}</span>
                </div>
              )}

              {/* Description */}
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#B09E96]' : 'text-[#6D5E56]'}`}>
                {item.description}
              </p>

              {/* Languages & Emergency Links */}
              <div
                className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                  isDark ? 'border-[#2C1C26]' : 'border-[#EAE1D5]'
                }`}
              >
                <span className={`${isDark ? 'text-[#8F7D75]' : 'text-[#8A7A72]'}`}>
                  Languages: <strong>{item.languages.join(', ')}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {item.chatUrl && (
                    <a
                      href={item.chatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E89382] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Chat Online</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {item.emergencyNumber && (
                    <span className="text-[#D94F5E] font-mono-clean font-semibold ml-1">
                      Emerg: {item.emergencyNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHelplines.length === 0 && (
        <div
          className={`text-center py-10 rounded-2xl border space-y-2 ${
            isDark ? 'bg-[#160E13] border-[#311E2A]' : 'bg-[#FAF5ED] border-[#E8DFD4]'
          }`}
        >
          <Globe className="w-8 h-8 mx-auto text-[#E89382] opacity-60" />
          <p className="text-xs font-semibold">No direct match found for "{searchTerm}"</p>
          <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-[#9E8B83]' : 'text-[#7D6E66]'}`}>
            Try searching by country name or refer to the International Befrienders directory available worldwide.
          </p>
        </div>
      )}
    </div>
  );
};
