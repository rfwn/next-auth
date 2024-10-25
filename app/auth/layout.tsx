const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-800">
      {children}
    </div>
  );
};

export default AuthLayout;
