import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Eye, Filter, Download, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DataPoint {
  timestamp: string;
  value: number;
  formattedTime?: string;
  metadata?: {
    source?: string;
    category?: string;
    details?: string;
  };
}

interface InteractiveChartProps {
  title: string;
  description: string;
  data: DataPoint[];
  type: "line" | "bar" | "area";
  metric: string;
  showTrend?: boolean;
  interactive?: boolean;
  crossFlowEnabled?: boolean;
  onDataPointClick?: (point: DataPoint) => void;
}

const chartConfig = {
  value: { color: "hsl(var(--primary))" },
  trend: { color: "hsl(var(--chart-2))" },
};

export const InteractiveChart = ({
  title,
  description,
  data,
  type,
  metric,
  showTrend = true,
  interactive = true,
  crossFlowEnabled = true,
  onDataPointClick
}: InteractiveChartProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const processedData = useMemo(() => {
    const cutoffDate = new Date();
    switch (timeRange) {
      case "24h":
        cutoffDate.setHours(cutoffDate.getHours() - 24);
        break;
      case "7d":
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        break;
    }

    return data
      .filter(point => new Date(point.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(point => ({
        ...point,
        formattedTime: new Date(point.timestamp).toLocaleDateString(),
      }));
  }, [data, timeRange]);

  const trend = useMemo(() => {
    if (processedData.length < 2) return 0;
    const latest = processedData[processedData.length - 1].value;
    const previous = processedData[processedData.length - 2].value;
    return ((latest - previous) / previous) * 100;
  }, [processedData]);

  const handleDataPointClick = (data: any) => {
    if (!interactive) return;
    
    const point = data.activePayload?.[0]?.payload;
    if (point) {
      setSelectedPoint(point);
      setShowDetails(true);
      onDataPointClick?.(point);
    }
  };

  const handleViewRelatedContent = (point: DataPoint) => {
    if (!crossFlowEnabled) return;

    // Navigate to related content based on data point metadata
    if (point.metadata?.category === "audit") {
      navigate(`/audit-details/${point.metadata.source}`);
    } else if (point.metadata?.category === "issue") {
      navigate(`/issue-detail/${point.metadata.source}`);
    } else if (point.metadata?.category === "analytics") {
      navigate("/analytics-dashboard");
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      onClick: handleDataPointClick,
      style: { cursor: interactive ? "pointer" : "default" }
    };

    switch (type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="formattedTime" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[2, 2, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        );
      
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="formattedTime" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="formattedTime" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        );
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {interactive && (
                  <Badge variant="outline" className="text-xs">
                    Interactive
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                  <SelectItem value="30d">30d</SelectItem>
                  <SelectItem value="90d">90d</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {showTrend && (
            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl font-bold">
                {processedData[processedData.length - 1]?.value.toLocaleString() || 0}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <div style={{ width: '100%', height: '100%' }}>
              <ResponsiveContainer>
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Data Point Detail Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Point Details</DialogTitle>
            <DialogDescription>
              Detailed information for {selectedPoint?.formattedTime}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Value</label>
                  <div className="text-lg font-semibold">{selectedPoint.value.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="text-lg">{selectedPoint.formattedTime}</div>
                </div>
              </div>
              
              {selectedPoint.metadata && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <div className="text-sm space-y-1">
                    {selectedPoint.metadata.source && (
                      <div><strong>Source:</strong> {selectedPoint.metadata.source}</div>
                    )}
                    {selectedPoint.metadata.category && (
                      <div><strong>Category:</strong> {selectedPoint.metadata.category}</div>
                    )}
                    {selectedPoint.metadata.details && (
                      <div><strong>Details:</strong> {selectedPoint.metadata.details}</div>
                    )}
                  </div>
                </div>
              )}
              
              {crossFlowEnabled && selectedPoint.metadata && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleViewRelatedContent(selectedPoint)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Related Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};