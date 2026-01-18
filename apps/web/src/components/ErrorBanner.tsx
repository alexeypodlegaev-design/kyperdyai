import Card from "./Card";

type ErrorBannerProps = {
  message: string;
};

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <Card className="border-candy-200 bg-candy-50">
      <p className="text-sm text-candy-500">⚠️ {message}</p>
    </Card>
  );
}
