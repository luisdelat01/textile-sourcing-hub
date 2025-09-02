import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SampleLogistics {
  courier: string;
  trackingNumber: string;
  sentDate: Date;
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  notes?: string;
}

interface SampleLogisticsCardProps {
  onSubmit: (logistics: SampleLogistics) => void;
}

const courierOptions = [
  "DHL Express",
  "FedEx",
  "UPS",
  "USPS",
  "TNT",
  "Aramex",
  "Local Courier"
];

export function SampleLogisticsCard({ onSubmit }: SampleLogisticsCardProps) {
  const { toast } = useToast();
  const [sentDate, setSentDate] = useState<Date>();

  const form = useForm<SampleLogistics>({
    defaultValues: {
      courier: "",
      trackingNumber: "",
      recipientName: "",
      recipientEmail: "",
      recipientAddress: "",
      notes: ""
    }
  });

  const handleSubmit = (data: SampleLogistics) => {
    if (!sentDate) {
      toast({
        title: "Error",
        description: "Please select a sent date",
        variant: "destructive"
      });
      return;
    }

    const logistics = {
      ...data,
      sentDate
    };

    onSubmit(logistics);
    
    console.log("SAMPLES_SENT:", logistics);
    toast({
      title: "Samples Sent",
      description: `Sample logistics recorded for ${data.courier} - ${data.trackingNumber}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Sample Logistics
        </CardTitle>
        <CardDescription>
          Record shipping details for sample delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Courier Selection */}
            <FormField
              control={form.control}
              name="courier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courier Service</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select courier service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courierOptions.map((courier) => (
                        <SelectItem key={courier} value={courier}>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            {courier}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the shipping carrier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tracking Number */}
            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tracking number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Courier-provided tracking reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sent Date */}
            <div className="space-y-2">
              <FormLabel>Sent Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !sentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {sentDate ? format(sentDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={sentDate}
                    onSelect={setSentDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Date when samples were dispatched
              </p>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Complete delivery address with postal code" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Full address where samples will be delivered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special delivery instructions or notes"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional delivery instructions or comments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button type="submit">
                <Package className="h-4 w-4 mr-2" />
                Record Sample Shipment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}