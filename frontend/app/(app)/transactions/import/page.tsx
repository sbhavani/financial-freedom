"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Papa from "papaparse";

// Schema for a single transaction
const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number(), // Input will be string, but coerced by hook form or manually handled
  name: z.string().min(1, "Name is required"),
  category: z.object({ id: z.number() }).nullable(),
  notes: z.string().optional(),
  direction: z.enum(["income", "expense"]),
});

const formSchema = z.object({
  accountType: z.enum(["cash-account", "credit-card", "loan"]),
  accountId: z.string().min(1, "Account is required"),
  transactions: z.array(transactionSchema).min(1, "At least one transaction is required"),
});

export default function TransactionImportPage() {
  const router = useRouter();
  const [csvInput, setCsvInput] = useState("");

  const { data: initialData, isLoading } = useSWR("/transactions/import", () =>
    axios.get("/transactions/import").then((res) => res.data)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "cash-account",
      accountId: "",
      transactions: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "transactions",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/transactions/import", {
        account: {
            id: values.accountId,
            type: values.accountType
        },
        transactions: values.transactions,
      });
      toast({
        title: "Success",
        description: "Transactions imported successfully",
      });
      router.push("/transactions");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to import transactions",
        variant: "destructive",
      });
    }
  };

  const parseCSV = () => {
    if (!csvInput.trim()) return;

    Papa.parse(csvInput.trim(), {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];
        const parsedTransactions = rows.map((cols) => {
          // Heuristic parsing
          const dateStr = cols.find(c => !isNaN(Date.parse(c))) || format(new Date(), "yyyy-MM-dd");

          const amountStr = cols.find(c => /^-?[\d,]+(\.\d+)?$/.test(c.replace(/[$,]/g, ''))) || "0";
          const amount = Math.abs(parseFloat(amountStr.replace(/[$,]/g, '')));
          const direction = amountStr.includes("-") ? "expense" : "income";

          const name = cols.find(c => c !== dateStr && c !== amountStr && c.length > 0) || "Unknown";

          return {
            date: !isNaN(Date.parse(dateStr)) ? format(new Date(dateStr), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            amount: isNaN(amount) ? 0 : amount,
            name: name,
            category: null,
            notes: "",
            direction: direction as "income" | "expense",
          };
        });

        replace(parsedTransactions);
        toast({
          title: "Parsed",
          description: `Parsed ${parsedTransactions.length} transactions. Please review before submitting.`,
        });
      },
      error: (error: Error) => {
        toast({
            title: "Error",
            description: `Failed to parse CSV: ${error.message}`,
            variant: "destructive"
        });
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  const accounts = [
    ...(initialData?.cashAccounts || []).map((acc: any) => ({ ...acc, type: "cash-account" })),
    ...(initialData?.creditCards || []).map((acc: any) => ({ ...acc, type: "credit-card" })),
    ...(initialData?.loans || []).map((acc: any) => ({ ...acc, type: "loan" })),
  ];

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Import Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            const selectedAccount = accounts.find((a: any) => a.id.toString() === value);
                            if (selectedAccount) {
                                form.setValue("accountType", selectedAccount.type);
                            }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account: any) => (
                            <SelectItem key={`${account.type}-${account.id}`} value={account.id.toString()}>
                              {account.name} ({account.type.replace("-", " ")})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel>Paste Transactions (CSV/Excel)</FormLabel>
                <Textarea
                  placeholder="Date, Amount, Name..."
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="font-mono"
                  rows={5}
                />
                <Button type="button" onClick={parseCSV} variant="secondary">
                  Parse Data
                </Button>
                <p className="text-sm text-muted-foreground">
                    Try pasting rows from Excel or a CSV. We will try to auto-detect Date, Amount, and Name.
                </p>
              </div>

              {fields.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input {...field} type="date" />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.direction`}
                              render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input {...field} />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                           <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.category`}
                              render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(val) => field.onChange(val ? { id: parseInt(val) } : null)}
                                        value={field.value?.id?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {initialData?.groups?.map((group: any) => (
                                                <div key={group.id}>
                                                    <SelectItem value={`group-${group.id}`} disabled className="font-semibold text-muted-foreground pl-2">
                                                        {group.name}
                                                    </SelectItem>
                                                    {group.categories.map((cat: any) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()} className="pl-4">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`transactions.${index}.notes`}
                              render={({ field }) => (
                                <FormItem>
                                  <Input {...field} />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => append({
                        date: format(new Date(), "yyyy-MM-dd"),
                        amount: 0,
                        name: "",
                        category: null,
                        notes: "",
                        direction: "expense"
                    })}>
                        Add Row
                    </Button>
                    <Button type="submit">Import Transactions</Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
