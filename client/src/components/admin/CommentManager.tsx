import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Comment } from "@shared/schema";
import { CheckCircle, XCircle, AlertTriangle, MessageSquare, Calendar, User } from "lucide-react";

interface CommentWithPost extends Comment {
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export default function CommentManager() {
  const [selectedComment, setSelectedComment] = useState<CommentWithPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("PENDING");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingComments, isLoading: loadingPending } = useQuery<CommentWithPost[]>({
    queryKey: ["/api/admin/comments/pending"],
    enabled: filter === "PENDING",
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/admin/comments/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Comment updated successfully",
        description: "The comment status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments/pending"] });
      setIsDialogOpen(false);
      setSelectedComment(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to update comment",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const openCommentDialog = (comment: CommentWithPost) => {
    setSelectedComment(comment);
    setIsDialogOpen(true);
  };

  const approveComment = (id: string) => {
    updateMutation.mutate({ id, status: "APPROVED" });
  };

  const rejectComment = (id: string) => {
    updateMutation.mutate({ id, status: "REJECTED" });
  };

  const markAsSpam = (id: string) => {
    updateMutation.mutate({ id, status: "SPAM" });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { variant: "secondary" as const, icon: AlertTriangle, color: "text-yellow-600" },
      APPROVED: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      REJECTED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      SPAM: { variant: "outline" as const, icon: XCircle, color: "text-gray-600" },
    };
    
    const config = variants[status as keyof typeof variants] || variants.PENDING;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <IconComponent className={`h-3 w-3 ${config.color}`} />
        <span>{status}</span>
      </Badge>
    );
  };

  const getAuthorDisplay = (comment: CommentWithPost) => {
    if (comment.user) {
      const name = comment.user.firstName || comment.user.lastName 
        ? `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim()
        : comment.user.email;
      return { name, type: "registered" };
    } else if (comment.authorName && comment.authorEmail) {
      return { name: `${comment.authorName} (${comment.authorEmail})`, type: "guest" };
    } else {
      return { name: "Anonymous", type: "anonymous" };
    }
  };

  const comments = filter === "PENDING" ? pendingComments : [];
  const isLoading = filter === "PENDING" ? loadingPending : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Comment Moderation</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending Comments</SelectItem>
              <SelectItem value="APPROVED">Approved Comments</SelectItem>
              <SelectItem value="REJECTED">Rejected Comments</SelectItem>
              <SelectItem value="SPAM">Spam Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-16 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => {
              const author = getAuthorDisplay(comment);
              
              return (
                <div key={comment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{author.name}</span>
                        <Badge variant={author.type === "registered" ? "default" : "outline"} className="text-xs">
                          {author.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(comment.status)}
                    </div>
                  </div>

                  {comment.post && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Post:</strong> {comment.post.title}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCommentDialog(comment)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    {comment.status === "PENDING" && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveComment(comment.id)}
                          disabled={updateMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectComment(comment.id)}
                          disabled={updateMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => markAsSpam(comment.id)}
                          disabled={updateMutation.isPending}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Spam
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === "PENDING" 
                ? "No pending comments. All caught up!" 
                : `No ${filter.toLowerCase()} comments found.`
              }
            </p>
          </div>
        )}

        {/* Comment Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comment Details</DialogTitle>
            </DialogHeader>
            {selectedComment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Author</Label>
                    <p className="text-sm text-gray-600">
                      {getAuthorDisplay(selectedComment).name}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedComment.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Date</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedComment.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>

                {selectedComment.post && (
                  <div>
                    <Label>Post</Label>
                    <p className="text-sm text-gray-600">{selectedComment.post.title}</p>
                  </div>
                )}

                <div>
                  <Label>Comment Content</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <p className="text-gray-700 leading-relaxed">{selectedComment.content}</p>
                  </div>
                </div>

                {selectedComment.status === "PENDING" && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      onClick={() => approveComment(selectedComment.id)}
                      disabled={updateMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updateMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rejectComment(selectedComment.id)}
                      disabled={updateMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => markAsSpam(selectedComment.id)}
                      disabled={updateMutation.isPending}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mark as Spam
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
