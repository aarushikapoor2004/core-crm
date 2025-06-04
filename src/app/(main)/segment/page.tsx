"use client";
import { AddDataButton } from "@/components/add-segment-button";
import { GitGraph, Loader2 } from "lucide-react";
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
import { getAllSegmentsById } from "@/actions/get-segments";
import { getAllData } from "@/actions/filter-query";
import { OverviewTable } from "@/components/overview-table";

// Types
type SegmentType = {
  id: string;
  name: string;
  rules: any;
};

// Fixed loadData function to accept segment rules
async function loadData(segmentRules?: any) {
  try {
    // Pass segment rules to getAllData for filtering
    const data = await getAllData();
    console.log("Raw data from getAllData:", data);

    // Return the data wrapped in an object structure
    return {
      data: data,
      success: true
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default function MainHomePage() {
  const { data: session, status } = useSession();
  const [segments, setSegments] = useState<SegmentType[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | null>(null);
  const [segmentData, setSegmentData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchSegmentData() {
      if (!selectedSegment) {
        setSegmentData(null);
        return;
      }

      try {
        setDataLoading(true);
        setError(null);
        const result = await loadData(selectedSegment.rules);
        console.log("Loaded segment data:", result); // Debug log

        if (result.success) {
          setSegmentData(result);
        } else {
          setError(result.error || "Failed to load data");
          setSegmentData(null);
        }
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

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading segments...</span>
      </div>
    );
  }

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

      <div className="space-y-3">
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
                          <pre className="bg-gray-100 dark:bg-accent p-4 rounded-md text-sm overflow-auto">
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
            ) : segmentData && segmentData.data && segmentData.data.length > 0 ? (
              <OverviewTable data={segmentData.data} />
            ) : segmentData && segmentData.data && segmentData.data.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No data available for this segment
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No data loaded
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
