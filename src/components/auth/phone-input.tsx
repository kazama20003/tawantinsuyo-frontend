"use client"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface PhoneInputProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function CustomPhoneInput({
  value,
  onValueChange,
  placeholder = "Ingresa tu número",
  disabled = false,
}: PhoneInputProps) {
  return (
    <div className="phone-input-wrapper">
      <PhoneInput
        country={"pe"}
        value={value}
        onChange={onValueChange}
        placeholder={placeholder}
        disabled={disabled}
        inputProps={{
          name: "phone",
          required: false,
          autoFocus: false,
        }}
        containerStyle={{
          width: "100%",
        }}
        inputStyle={{
          width: "100%",
          height: "48px",
          fontSize: "16px",
          border: "2px solid #d1d5db",
          borderRadius: "12px",
          paddingLeft: "60px",
          backgroundColor: "white",
          transition: "all 0.3s ease",
        }}
        buttonStyle={{
          border: "2px solid #d1d5db",
          borderRight: "none",
          borderRadius: "12px 0 0 12px",
          backgroundColor: "white",
          padding: "0 12px",
          transition: "all 0.3s ease",
        }}
        dropdownStyle={{
          borderRadius: "8px",
          border: "2px solid #d1d5db",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          maxHeight: "200px",
        }}
        searchStyle={{
          margin: "8px",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
        }}
        enableSearch={true}
        searchPlaceholder="Buscar país..."
        specialLabel=""
        countryCodeEditable={false}
        preferredCountries={["pe", "us", "mx", "ar", "cl", "co", "ec", "bo"]}
      />

      <style jsx global>{`
        .phone-input-wrapper .react-tel-input:focus-within .form-control {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
        }
        
        .phone-input-wrapper .react-tel-input:focus-within .flag-dropdown {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
        }
        
        .phone-input-wrapper .react-tel-input .form-control:hover {
          border-color: #9ca3af !important;
        }
        
        .phone-input-wrapper .react-tel-input .flag-dropdown:hover {
          border-color: #9ca3af !important;
        }
        
        .phone-input-wrapper .react-tel-input .form-control::placeholder {
          color: #9ca3af;
        }
        
        .phone-input-wrapper .react-tel-input .country-list .country:hover {
          background-color: #f3f4f6;
        }
        
        .phone-input-wrapper .react-tel-input .country-list .country.highlight {
          background-color: #dbeafe;
        }
        
        @media (min-width: 1024px) {
          .phone-input-wrapper .react-tel-input .form-control {
            height: 56px !important;
            font-size: 16px !important;
          }
          
          .phone-input-wrapper .react-tel-input .flag-dropdown {
            height: 56px !important;
          }
        }
        
        .phone-input-wrapper .react-tel-input .form-control:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f9fafb;
        }
        
        .phone-input-wrapper .react-tel-input .flag-dropdown.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  )
}
