import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddParameterForm from "./AddParameterForm";
import AddScheduleForm, { AddScheduleFormSchema } from "./AddScheduleForm";
import { ResponsiveModal,ResponsiveModalTitle,ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader } from "@/components/ui/responsive-modal";
import { useState } from "react";



type AddScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MultiFormModal = ({ isOpen, onClose }: AddScheduleModalProps) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [scheduleFormData, setScheduleFormData] = useState<AddScheduleFormSchema | null>(null);

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="schedule">Schedule</TabsTrigger>
    <TabsTrigger value="parameter">Parameter</TabsTrigger>
  </TabsList>
  {/* <TabsContent value="schedule"><AddScheduleForm onClose={onClose}/></TabsContent> */}
  {/* <TabsContent value="schedule">
              <AddScheduleForm
                
                goToNextTab={() => setActiveTab("parameter")}
              />
            </TabsContent> */}
            <TabsContent value="schedule">
  <AddScheduleForm
    goToNextTab={(data) => {
      setScheduleFormData(data);
      setActiveTab("parameter");
    }}
    initialData={scheduleFormData}
  />
</TabsContent>
  {/* <TabsContent value="parameter"><AddParameterForm onClose={onClose}/></TabsContent> */}
  <TabsContent value="parameter">
  {scheduleFormData && (
    <AddParameterForm
      onClose={onClose}
      scheduleFormData={scheduleFormData}
    />
    
  )}
</TabsContent>
  <ResponsiveModalTitle></ResponsiveModalTitle>
          <ResponsiveModalDescription></ResponsiveModalDescription>
</Tabs>

          
        </ResponsiveModalHeader>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default MultiFormModal;
