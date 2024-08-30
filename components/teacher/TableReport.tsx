"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function TableReportComponent({
  reports,
}: {
  reports: { id: string; name: string | null; reports: string[] }[];
}) {
  const { toast } = useToast();
  const deleteReport = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete(`/api/user/${id}/report`).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => location.reload(),
  });

  return (
    <div className="flex flex-col gap-3 mt-3">
      <DialogGrade title="Add new" users={users} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No reports found
              </TableCell>
            </TableRow>
          )}

          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.name}</TableCell>
              <TableCell>{report.reports}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0">
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[160px]">
                    <DropdownMenuItem asChild>
                      <DialogGrade
                        title="Edit"
                        userValue={grade.user}
                        users={users}
                        defaultValue={grade.value}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        deleteReport.mutate(report.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
