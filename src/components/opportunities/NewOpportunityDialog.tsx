import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpportunities, STAGES } from "@/stores/useOpportunities";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  contact: z.string().min(1, "Contact is required"),
  brand: z.string().min(1, "Brand is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  stage: z.enum(["Inbound Request", "Clarify Buyer Intent", "Samples Sent", "Quote Sent", "PO Received", "In Production", "Ready to Ship", "Closed – Delivered"]),
  assignedRep: z.string().min(1, "Assigned rep is required"),
  source: z.string().optional(),
  nextStep: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function NewOpportunityDialog({ onCreate, open: controlledOpen, onOpenChange }: { onCreate?: (payload: any) => void, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  console.log('🔴 NewOpportunityDialog function called - RENDER START');
  
  React.useEffect(() => {
    console.log('NewOpportunityDialog rendered. open:', controlledOpen);
  }, [controlledOpen]);
  
  React.useEffect(() => {
    console.log('NewOpportunityDialog component mounted/updated');
    console.log('Props received:', { onCreate: !!onCreate, controlledOpen, onOpenChange: !!onOpenChange });
  });
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;
  const { addOpportunity } = useOpportunities();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      contact: "",
      brand: "",
      priority: "Medium",
      stage: "Inbound Request",
      assignedRep: "",
      source: "",
      nextStep: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      company: data.company,
      contact: data.contact,
      brand: data.brand,
      priority: data.priority,
      stage: data.stage,
      assignedRep: data.assignedRep,
      source: data.source || "Direct",
      nextStep: data.nextStep || "Follow up with client",
      missingSpecs: true,
      hasSamples: false,
      hasQuote: false,
      hasPO: false,
      hasLabDips: false,
    };

    if (onCreate) {
      onCreate(payload);
    } else {
      addOpportunity(payload);
    }
    
    toast({
      title: "Opportunity created",
      description: `${data.name} has been added to the board`,
    });
    
    handleOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        {open && (
          <div style={{ color: 'red', fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
            DEBUG: Dialog is open and rendered
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Create New Opportunity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opportunity Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Spring Collection Fabrics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <Input placeholder="Fashion Forward Inc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <Input placeholder="Trendy Wear" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STAGES.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedRep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Rep *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rep" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                        <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                        <SelectItem value="David Park">David Park</SelectItem>
                        <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Website Inquiry">Website Inquiry</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
                        <SelectItem value="Existing Client">Existing Client</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextStep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Step</FormLabel>
                    <FormControl>
                      <Input placeholder="Follow up with client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Opportunity</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}