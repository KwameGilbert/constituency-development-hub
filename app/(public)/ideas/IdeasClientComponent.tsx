"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Lightbulb,
  ThumbsUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import PageHero from "@/components/hero/PageHero";
import { ideasService, Idea } from "@/lib/services/ideas-service";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function IdeasClient() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      // The service already calls /ideas/public which filters for approved/implemented status
      const response = await ideasService.getPublicIdeas();
      if (response.success) {
        setIdeas(response.data.ideas);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-500 hover:bg-green-600";
      case "approved":
        return "bg-blue-500 hover:bg-blue-600";
      case "under_review":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 w-full bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHero
        title="Community Ideas"
        description="Discover approved projects and initiatives suggested by our constituents."
        backgroundImage="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80"
      />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Future: Add 'Submit Idea' button here */}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-red-700">
                Unable to load ideas
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={fetchIdeas}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-gray-900">
                No ideas to show
              </h3>
              <p className="text-gray-500">
                There are no approved community ideas to display at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
                    <div
                      className={`h-2 w-full ${idea.status === "implemented" ? "bg-green-500" : "bg-blue-500"}`}
                    />

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {idea.category}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(idea.status)} text-white border-0 capitalize`}
                        >
                          {idea.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <CardTitle className="text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {idea.title}
                      </CardTitle>

                      <p className="text-gray-600 text-sm line-clamp-4 flex-1 mb-4">
                        {idea.description}
                      </p>

                      {/* Stats / Info Footer */}
                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 focus:text-blue-600 transition-colors">
                            <ThumbsUp
                              className={`h-4 w-4 ${idea.votes && idea.votes > 0 ? "text-blue-500 fill-blue-50" : ""}`}
                            />
                            <span className="font-medium">
                              {idea.votes || 0}
                            </span>{" "}
                            Votes
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(idea.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        {/* Example Progress for Implemented ideas */}
                        {idea.status === "implemented" && (
                          <div className="pt-2">
                            <div className="flex justify-between text-xs mb-1 font-medium text-green-700">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Implemented
                              </span>
                              <span>100%</span>
                            </div>
                            <Progress
                              value={100}
                              className="h-1.5 bg-green-100 [&>div]:bg-green-500"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
