import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Departments() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    icon: "building",
  });

  const { data: departments, isLoading } = useQuery({
    queryKey: ["/api/departments"],
  });

  const createMutation = useMutation({
    mutationFn: async (department) => {
      return apiRequest("/api/departments", {
        method: "POST",
        body: JSON.stringify(department),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department created successfully",
      });
      setIsCreateDialogOpen(false);
      setNewDepartment({
        name: "",
        description: "",
        color: "#3b82f6",
        icon: "building",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest(`/api/departments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    createMutation.mutate(newDepartment);
  };

  const handleDeleteDepartment = (id, name, isCustom) => {
    if (!isCustom) {
      toast({
        title: "Cannot Delete",
        description: "Default departments cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getDepartmentBadgeColor = (color) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
              Departments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage distribution center departments and their configurations
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-department">
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-department">
              <form onSubmit={handleCreateDepartment}>
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                  <DialogDescription>
                    Add a new department to organize your parcel processing
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      data-testid="input-department-name"
                      placeholder="e.g., Express Delivery"
                      value={newDepartment.name}
                      onChange={(e) =>
                        setNewDepartment({ ...newDepartment, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      data-testid="input-department-description"
                      placeholder="Brief description of the department"
                      value={newDepartment.description}
                      onChange={(e) =>
                        setNewDepartment({ ...newDepartment, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2">
                      {["blue", "green", "orange", "purple", "red", "yellow"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          data-testid={`button-color-${color}`}
                          className={`w-8 h-8 rounded-full ${getDepartmentBadgeColor(color)} ${
                            newDepartment.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                          }`}
                          onClick={() => setNewDepartment({ ...newDepartment, color })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      data-testid="input-department-icon"
                      placeholder="Icon name (e.g., building, truck)"
                      value={newDepartment.icon}
                      onChange={(e) =>
                        setNewDepartment({ ...newDepartment, icon: e.target.value })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || !newDepartment.name}
                    data-testid="button-submit-department"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Department"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
            <CardDescription>
              View and manage all departments in the distribution center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <TableRow key={dept.id} data-testid={`row-department-${dept.id}`}>
                        <TableCell className="font-medium" data-testid={`text-name-${dept.id}`}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {dept.name}
                          </div>
                        </TableCell>
                        <TableCell data-testid={`text-description-${dept.id}`}>
                          {dept.description || "—"}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`w-6 h-6 rounded-full ${getDepartmentBadgeColor(dept.color)}`}
                            data-testid={`color-indicator-${dept.id}`}
                          />
                        </TableCell>
                        <TableCell data-testid={`text-icon-${dept.id}`}>{dept.icon}</TableCell>
                        <TableCell>
                          <Badge
                            variant={dept.isCustom ? "default" : "secondary"}
                            data-testid={`badge-type-${dept.id}`}
                          >
                            {dept.isCustom ? "Custom" : "Default"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {dept.isCustom && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id, dept.name, dept.isCustom)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${dept.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No departments found. Create your first department to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
