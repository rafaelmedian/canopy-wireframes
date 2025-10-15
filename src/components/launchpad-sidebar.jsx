import { Check } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, label: 'Language' },
  { id: 2, label: 'Connect Repo' },
  { id: 3, label: 'Main Info' },
  { id: 4, label: 'Branding & Media' },
  { id: 5, label: 'Links & Documentation' },
  { id: 6, label: 'Launch Settings' },
  { id: 7, label: 'Review & Payment' },
]

export default function LaunchpadSidebar({ currentStep = 1, completedSteps = [] }) {
  return (
    <Sidebar collapsible="none" className="border-r min-h-screen sticky top-0">
      <SidebarHeader className="p-6">
        <img
          src="/svg/logo.svg"
          alt="Canopy"
          className="h-4 invert"
        />
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu className="gap-3">
          {steps.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = completedSteps.includes(step.id)
            
            return (
              <SidebarMenuItem key={step.id}>
                <SidebarMenuButton
                  className={cn(
                    "gap-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/10",
                    !isActive && !isCompleted && "text-muted-foreground",
                    isCompleted && !isActive && "text-foreground"
                  )}
                  asChild
                >
                  <div>
                    <div className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                      isActive && "bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "text-muted-foreground",
                      isCompleted && !isActive && "bg-primary/20 text-primary"
                    )}>
                      {isCompleted ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span>{step.id.toString().padStart(2, '0')}</span>
                      )}
                    </div>
                    <span className="font-medium">
                      {step.label}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}