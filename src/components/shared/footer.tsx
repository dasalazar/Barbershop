import { Card, CardContent } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Card className="rounded-none border-b-0 border-r-0 border-l-0">
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400 text-center">
            © 2026 Copyright <span className="font-bold">Barber Shop</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  );
}
