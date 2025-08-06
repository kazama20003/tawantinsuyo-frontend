'use client'

import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip' // Import Tooltip components

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber = '+51913876154',
  message = 'Quiero saber más información sobre tours a medida.',
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message)

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleWhatsAppClick}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-8 h-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-green-600 text-white px-3 py-2 rounded-md shadow-md text-sm">
          {message}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  )
}
