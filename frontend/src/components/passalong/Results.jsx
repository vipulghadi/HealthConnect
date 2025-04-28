"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Results({ responses }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Previous Responses</h3>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Design</TableHead>
              <TableHead>Response Time (s)</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={index}>
                <TableCell>{response.design}</TableCell>
                <TableCell>{response.responseTime.toFixed(1)}</TableCell>
                <TableCell>
                  {new Date(response.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{response.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
