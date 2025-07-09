"use client"

import { useState, useMemo } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import countries from "world-countries"

interface CountrySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Función para convertir código de país a emoji de bandera
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌍"
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function CountrySelect({
  value,
  onValueChange,
  placeholder = "Seleccionar país...",
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)

  // Preparar lista de países ordenada alfabéticamente
  const countryOptions = useMemo(() => {
    return countries
      .map((country) => ({
        value: country.cca2, // Código ISO de 2 letras
        label: country.name.common,
        flag: getFlagEmoji(country.cca2),
        region: country.region,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [])

  const selectedCountry = countryOptions.find((country) => country.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between px-4 py-3 h-12 lg:h-14 font-normal text-left border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white",
            className,
          )}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-3">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="truncate text-base">{selectedCountry.label}</span>
            </div>
          ) : (
            <span className="text-gray-500 text-base">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar país..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró el país.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {countryOptions.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onValueChange(country.value)
                    setOpen(false)
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 truncate">{country.label}</span>
                  <span className="text-xs text-gray-500">{country.value}</span>
                  <Check className={cn("ml-auto h-4 w-4", value === country.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
