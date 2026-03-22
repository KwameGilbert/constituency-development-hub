import { blogPosts } from "@/data/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cleanupHtml } from "@/lib/utils";

function ArticlesGrid() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
            Media Center
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Featured Articles
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="overflow-hidden rounded-2xl bg-white shadow"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold text-red-600"
              >
                <div className="h-48 overflow-hidden">
                  <Image
                    width={400}
                    height={192}
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {cleanupHtml(post.excerpt || "")}
                  </p>
                  Read story →
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticlesGrid;
