"use client";
import { AddDataButton } from "@/components/add-segment-button";
import { GitGraph, ChevronDown, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { segmentSchema } from "@/schema/segment";
import { getAllSegmentsById } from "@/actions/get-segments";

// Types
type SegmentType = {
  id: string;
  name: string;
  rules: any;
};

type LoadDataResult = {
  // Define your data structure here based on what loadData returns
  data: any[];
  total: number;
  // Add other fields as needed
};

// Mock loadData function - replace with your actual implementation
async function loadData(rules: any): Promise<LoadDataResult> {
  // Replace this with your actual loadData implementation
  try {
    // Simulate API call based on rules
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data - replace with actual data fetching logic
    return {
      data: [
        { id: 1, name: "Sample Data 1", value: "Value 1" },
        { id: 2, name: "Sample Data 2", value: "Value 2" },
      ],
      total: 2
    };
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

export default function MainHomePage() {
  const { data: session, status } = useSession();
  const [segments, setSegments] = useState<SegmentType[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | null>(null);
  const [segmentData, setSegmentData] = useState<LoadDataResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all segments when component mounts
  useEffect(() => {
    async function fetchSegments() {
      if (status === "loading") return; // Wait for auth to load

      if (status === "unauthenticated" || !session?.user?.id) {
        setError("Please log in to view segments");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userSegments = await getAllSegmentsById(session.user.id);
        setSegments(userSegments);

        // Auto-select first segment if available
        if (userSegments.length > 0) {
          setSelectedSegment(userSegments[0]);
        }
      } catch (err) {
        console.error("Error loading segments:", err);
        setError("Failed to load segments");
      } finally {
        setLoading(false);
      }
    }

    fetchSegments();
  }, [session, status]);

  // Load data when segment is selected
  useEffect(() => {
    async function fetchSegmentData() {
      if (!selectedSegment || !selectedSegment.rules) return;

      try {
        setDataLoading(true);
        setError(null);
        const result = await loadData(selectedSegment.rules);
        setSegmentData(result);
      } catch (err) {
        console.error("Error loading segment data:", err);
        setError("Failed to load segment data");
        setSegmentData(null);
      } finally {
        setDataLoading(false);
      }
    }

    fetchSegmentData();
  }, [selectedSegment]);

  const handleSegmentSelect = (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId);
    if (segment) {
      setSelectedSegment(segment);
    }
  };

  // Show loading state
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading segments...</span>
      </div>
    );
  }

  // Show error state
  if (error && !selectedSegment) {
    return (
      <div className="space-y-3">
        <div className="w-full">
          <div className="flex justify-between pt-2">
            <div>
              <h2 className="text-2xl font-semibold">Overview</h2>
            </div>
            <div className="flex gap-2">
              <AddDataButton />
            </div>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="w-full">
        <div className="flex justify-between pt-2">
          <div>
            <h2 className="text-2xl font-semibold">Overview</h2>
          </div>
          <div className="flex gap-2">
            <AddDataButton />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Segment Selection Card */}
        <Card className="@container/card w-xs min-w-[300px]">
          <CardHeader className="relative">
            <CardDescription className="flex gap-1 items-center">
              <GitGraph className="size-4" /> Current Segment
            </CardDescription>

            {segments.length > 0 ? (
              <div className="space-y-3">
                <Select
                  value={selectedSegment?.id || ""}
                  onValueChange={handleSegmentSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedSegment && (
                  <>
                    <CardTitle className="@[250px]/card:text-xl text-xl font-semibold tabular-nums">
                      {selectedSegment.name}
                    </CardTitle>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="text-xs p-2 mt-2 w-full" size="sm">
                          Show Rules
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Segment Rules</h3>
                          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                            {JSON.stringify(selectedSegment.rules, null, 2)}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <CardTitle className="text-gray-500">No Segments Found</CardTitle>
                <CardDescription>Create your first segment to get started</CardDescription>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Data Display Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Segment Data
              {dataLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              {selectedSegment
                ? `Data for ${selectedSegment.name}`
                : "Select a segment to view data"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSegment ? (
              <div className="text-center text-gray-500 py-8">
                Select a segment to view its data
              </div>
            ) : dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading segment data...
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                {error}
              </div>
            ) : segmentData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Records: {segmentData.total}
                  </span>
                </div>

                {/* Data Table */}
                <div className="border rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {segmentData.data.map((item, index) => (
                          <tr key={item.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{item.id}</td>
                            <td className="px-4 py-2 text-sm">{item.name}</td>
                            <td className="px-4 py-2 text-sm">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {segmentData.data.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No data found for this segment
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

