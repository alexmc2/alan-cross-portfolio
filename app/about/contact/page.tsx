// app/about/contact/page.tsx
'use client';

import { useForm, ValidationError } from '@formspree/react';
import { Mail, Phone, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [state, handleSubmit] = useForm('xldpbpjn');

  if (state.succeeded) {
    return (
      <div className="container mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-12 text-center dark:border-sky-800 dark:bg-sky-900/20">
          <h1 className="mb-4 text-3xl font-bold text-sky-900 dark:text-sky-100">
            Thanks for getting in touch!
          </h1>
          <p className="text-lg text-sky-800 dark:text-sky-200">
            I'll get back to you very soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Get in touch</h1>
        <p className="text-xl text-muted-foreground">
          Questions about the website template? Want to see a demo?
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Contact details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:alexandramcgarryx@gmail.com"
                    className="text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    alexandramcgarryx@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:07793565433"
                    className="text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    07793 565 433
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    Cambridge, UK
                    <br />
                    Available for in-person meetings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-6">
            <p className="text-sm text-muted-foreground">
              I typically respond within 24 hours. If you'd prefer to chat in
              person, I'm happy to meet in person in Cambridge.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2"
                placeholder="Your name"
              />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2"
                placeholder="your@email.com"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="mt-2"
                placeholder="07123 456789"
              />
              <ValidationError
                prefix="Phone"
                field="phone"
                errors={state.errors}
              />
            </div>

            <div>
              <Label htmlFor="business">Business Name (optional)</Label>
              <Input
                id="business"
                name="business"
                type="text"
                className="mt-2"
                placeholder="Your business name"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                className="mt-2"
                placeholder="Tell me about what you're looking for..."
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>

            <Button
              type="submit"
              disabled={state.submitting}
              className="h-12 w-full text-lg sm:w-auto sm:px-12"
            >
              {state.submitting ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
