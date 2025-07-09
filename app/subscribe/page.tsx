import NewsletterSubscription from "@/components/newsletter/newsletter-subscription";

export default function Subscribe() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Subscribe to our Newsletter
      </h1>
      <p className="text-muted-foreground mb-6 text-center max-w-xl">
        Stay updated with the latest news, articles, and exclusive content from
        our blog. Enter your email below to join our newsletter!
      </p>
      <NewsletterSubscription />
    </div>
  );
}