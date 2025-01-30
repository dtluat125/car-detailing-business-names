import Inner from "@/app/_inner";

// Define metadata generation for Next.js
// export async function generateMetadata(): Promise<Metadata> {
//   const meta = await generateMetaData();
//   return {
//     title: meta.title,
//     description: meta.description,
//     openGraph: {
//       title: meta.title,
//       description: meta.description,
//       type: "website",
//     },
//   };
// }

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-10">
      <Inner />
    </div>
  );
}
