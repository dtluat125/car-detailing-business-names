"use client";
import {
  BusinessCategory,
  generateBusinessNames,
  generateFAQs,
  generateMetaData,
} from "@/app/actions";
import GenerateButton from "@/components/GenerateButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

export default function Inner() {
  const [businessNames, setBusinessNames] = useState<
    Record<
      BusinessCategory,
      {
        name: string;
        tagline: string;
        description: string;
        bestFor: string[];
      }[]
    >
  >();
  const [faqs, setFaqs] = useState<
    {
      question: string;
      answer: string;
    }[]
  >();

  const [metadata, setMetadata] = useState({
    title: "Car Detailing Business Name Generator | Zarla",
    description:
      "Get unique AI-generated business names for your car detailing company instantly!",
  });
  const [isPending, startTransition] = useTransition();

  const handleFetch = async () => {
    startTransition(async () => {
      const businessNamesData = await generateBusinessNames();
      setBusinessNames(businessNamesData);

      const faqsData = await generateFAQs();
      setFaqs(faqsData);

      const metadataData = await generateMetaData();
      setMetadata(metadataData);
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      {/* Header Section */}
      <section className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          {isPending ? (
            <Skeleton className="w-full h-4" />
          ) : (
            (metadata.title as string)
          )}
        </h1>
        <div className="text-base md:text-lg text-gray-700 mb-6">
          {isPending ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />

              <Skeleton className="w-full h-4" />
            </div>
          ) : (
            (metadata.description as string)
          )}
        </div>
        {!isPending && <GenerateButton />}
      </section>
      {/* Category-based AI-Generated Names in Responsive Table Format */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          Creative Business Name Ideas
        </h2>
        {isPending ? (
          <Table className="min-w-[600px]">
            <TableHeader className="bg-gray-100">
              <TableRow className="text-sm md:text-base">
                <TableHead className="p-3 text-left">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead className="p-3 text-left">
                  {" "}
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead className="p-3 text-left">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead className="p-3 text-left">
                  {" "}
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="">
                <TableCell className="p-3 text-sm md:text-base font-medium">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base italic text-gray-600">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base text-gray-500">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
              <TableRow className="">
                <TableCell className="p-3 text-sm md:text-base font-medium">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base italic text-gray-600">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base text-gray-500">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
              <TableRow className="">
                <TableCell className="p-3 text-sm md:text-base font-medium">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base italic text-gray-600">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="p-3 text-sm md:text-base text-gray-500">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          businessNames &&
          Object.entries(businessNames).map(([category, names]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                {category}
              </h3>
              <div className="overflow-x-auto rounded-lg border shadow-md">
                <Table className="min-w-[600px]">
                  <TableHeader className="bg-gray-100">
                    <TableRow className="text-sm md:text-base">
                      <TableHead className="p-3 text-left">Name</TableHead>
                      <TableHead className="p-3 text-left">Tagline</TableHead>
                      <TableHead className="p-3 text-left">
                        Description
                      </TableHead>
                      <TableHead className="p-3 text-left">Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {names.map(
                      ({ name, tagline, description, bestFor }, index) => (
                        <TableRow key={index} className="border">
                          <TableCell className="p-3 text-sm md:text-base font-medium">
                            {name}
                          </TableCell>
                          <TableCell className="p-3 text-sm md:text-base italic text-gray-600">
                            &quot;{tagline}&quot;
                          </TableCell>
                          <TableCell className="p-3 text-sm md:text-base">
                            {description}
                          </TableCell>
                          <TableCell className="p-3 text-sm md:text-base text-gray-500">
                            {bestFor.join(", ")}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {isPending ? (
            <>
              <Skeleton className="h-4 w-full my-2" />
              <Skeleton className="h-4 w-full my-2" />
            </>
          ) : (
            faqs &&
            faqs.map(({ question, answer }, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-gray-900">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-sm md:text-base">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </section>

      {/* Branding & Business Strategy Tips */}
      <section className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          How to Choose the Best Business Name
        </h2>
        <p className="text-gray-700 mb-4">
          Picking the right name for your car detailing business is crucial for
          branding and attracting customers. Here are some expert tips:
        </p>
        <ul className="list-disc pl-4 md:pl-6 space-y-3 text-gray-700 text-sm md:text-base">
          <li>
            <strong>Keep it Simple & Memorable:</strong> Shorter names tend to
            be more recognizable and easier to market.
          </li>
          <li>
            <strong>Use Descriptive Keywords:</strong> Words like
            &quot;Shine,&quot; &quot;Auto,&quot; and &quot;Detailing&quot; help
            immediately define your business.
          </li>
          <li>
            <strong>Check Domain & Social Media Availability:</strong> Ensure
            your business name is available as a website and on social media
            platforms.
          </li>
          <li>
            <strong>Consider Future Growth:</strong> Avoid overly niche names
            that may limit expansion opportunities.
          </li>
        </ul>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          Need More Custom Branding Help?
        </h2>
        <p className="text-gray-700 mb-4 text-sm md:text-base">
          We offer business name brainstorming, domain research, and branding
          assistance.
        </p>
        <Link
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
          href="/"
        >
          Explore branding services 🚀
        </Link>
      </section>
    </>
  );
}
