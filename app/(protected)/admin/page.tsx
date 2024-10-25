'use client';

import { useEffect, useState, useTransition } from 'react';
import useFetch from '@/hooks/use-fetch';
import { Button } from '@/components/ui/button';
import { RoleGate } from '@/components/auth/role-gate';
import { FormSuccess } from '@/components/form-messages';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { admin } from '@/actions/admin';

interface ActionTestProps {
  label: string;
  onClick: () => Promise<void>;
  loading?: boolean;
}

const ActionTest: React.FC<ActionTestProps> = ({
  label,
  onClick,
  loading = false
}) => (
  <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
    <p className="text-sm font-medium">{label}</p>
    <Button onClick={onClick} disabled={loading}>
      {loading ? 'Loading...' : 'Test'} {/* Change button text based on loading state */}
    </Button>
  </div>
);

const AdminPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    fetchData: onAPIRouteClick
  } = useFetch<{ message: string }>('/api/admin');

  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (data) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error);
    }
  }, [data, error]);

  const onServerActionClick = async () => {
    startTransition(async () => {
      const response = await admin();
      if (response.error) {
        toast.error(response.error);
      }
      if (response.success) {
        toast.success(response.success);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="Allowed" />
        </RoleGate>
        <ActionTest
          label="Admin-only API Route"
          onClick={onAPIRouteClick}
          loading={loading}
        />
        <ActionTest
          label="Admin-only Server Action"
          onClick={onServerActionClick}
          loading={isLoading} // Using isLoading from useTransition
        />
      </CardContent>
    </Card>
  );
};

export default AdminPage;
