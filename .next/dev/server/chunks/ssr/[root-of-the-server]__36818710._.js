module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(public)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(public)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/api-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
const BASE_URL = ("TURBOPACK compile-time value", "http://app.comdevhub-api.com/v1");
async function apiClient(endpoint, options = {}) {
    const { requiresAuth = true, isFormData = false, ...fetchOptions } = options;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const headers = new Headers(fetchOptions.headers);
    // Only set Content-Type for requests with a body (POST, PUT, PATCH)
    // Skip setting Content-Type for FormData (browser sets it with boundary)
    const method = (fetchOptions.method || 'GET').toUpperCase();
    const hasBody = [
        'POST',
        'PUT',
        'PATCH'
    ].includes(method);
    if (hasBody && !isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (requiresAuth) {
        // Try to get token from multiple sources
        let token = null;
        // 1. Try localStorage (for client-side) - Prioritize this!
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // 2. Fallback to environment variable (for development/testing)
        if (!token) {
            const envToken = ("TURBOPACK compile-time value", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJldmVudGljLWFwaSIsImlhdCI6MTc2ODc3MDI3OSwiZXhwIjoxMDAwMDAwMDE3Njg3NzAyNzgsImRhdGEiOnsiaWQiOjMsImVtYWlsIjoiam9obi5tZW5zYWhAY29uc3RpdHVlbmN5Lmdvdi5naCIsInJvbGUiOiJ3ZWJfYWRtaW4iLCJzdGF0dXMiOiJhY3RpdmUifX0.H0TVhZskuWoZjbBETb76ffO7yvQ6eTP0AFb84MiZgjI");
            if (envToken && envToken !== "YOUR_JWT_TOKEN_HERE") {
                token = envToken;
            }
        }
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }
    let response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...fetchOptions,
            headers
        });
    } catch (error) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.error(`[API Network Error] ${method} ${BASE_URL}${endpoint}`, error);
        }
        throw new Error(`Network error: Failed to connect to API at ${BASE_URL}${endpoint}`);
    }
    // Try to parse JSON response
    let data;
    try {
        data = await response.json();
    } catch  {
        // If JSON parsing fails, throw with status info
        throw new Error(`HTTP ${response.status}: Failed to parse response`);
    }
    if (!response.ok) {
        // Handle 401 Unauthorized globally
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Only log detailed errors in development for debugging
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('[API]', response.status, endpoint, data?.message || data?.error || '');
        }
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: An error occurred`;
        throw new Error(errorMessage);
    }
    return data;
}
}),
"[project]/lib/services/blog-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blogService",
    ()=>blogService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-rsc] (ecmascript)");
;
const blogService = {
    // Public Routes
    getAllPosts: async (page = 1, limit = 10)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/blog?page=${page}&limit=${limit}`, {
            requiresAuth: false
        });
    },
    getFeaturedPosts: async (limit = 3)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/blog/featured?limit=${limit}`, {
            requiresAuth: false
        });
    },
    getCategories: async ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])("/blog/categories", {
            requiresAuth: false
        });
    },
    getPostBySlug: async (slug)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/blog/${slug}`, {
            requiresAuth: false
        });
    },
    // Admin Routes
    getAdminPosts: async (page = 1, limit = 10, status)=>{
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        if (status) query.append("status", status);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/admin/blog?${query.toString()}`);
    },
    getPostById: async (id)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/admin/blog/${id}`);
    },
    createPost: async (data, file)=>{
        if (file) {
            // Send as multipart/form-data with file
            const formData = new FormData();
            formData.append('image', file);
            // Append other fields
            Object.entries(data).forEach(([key, value])=>{
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])("/admin/blog", {
                method: "POST",
                body: formData,
                isFormData: true
            });
        } else {
            // Send as JSON without file
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])("/admin/blog", {
                method: "POST",
                body: JSON.stringify(data)
            });
        }
    },
    updatePost: async (id, data, file)=>{
        if (file) {
            // Send as multipart/form-data with file
            const formData = new FormData();
            formData.append('image', file);
            // Append other fields
            Object.entries(data).forEach(([key, value])=>{
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/admin/blog/${id}`, {
                method: "PUT",
                body: formData,
                isFormData: true
            });
        } else {
            // Send as JSON without file
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/admin/blog/${id}`, {
                method: "PUT",
                body: JSON.stringify(data)
            });
        }
    },
    deletePost: async (id)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiClient"])(`/admin/blog/${id}`, {
            method: "DELETE"
        });
    }
};
}),
"[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_27d3faa9b1a9d8cd0e1872aee1c051b9/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(public)/blog/[slug]/BlogPostClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(public)/blog/[slug]/BlogPostClient.tsx <module evaluation>", "default");
}),
"[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_27d3faa9b1a9d8cd0e1872aee1c051b9/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(public)/blog/[slug]/BlogPostClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(public)/blog/[slug]/BlogPostClient.tsx", "default");
}),
"[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$public$292f$blog$2f5b$slug$5d2f$BlogPostClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$public$292f$blog$2f5b$slug$5d2f$BlogPostClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$public$292f$blog$2f5b$slug$5d2f$BlogPostClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "getImageUrl",
    ()=>getImageUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function getImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("data:")) return path;
    const apiUrl = ("TURBOPACK compile-time value", "http://app.comdevhub-api.com/v1") || "http://localhost:8080";
    let apiOrigin = "";
    try {
        apiOrigin = new URL(apiUrl).origin;
    } catch  {
        return path;
    }
    // Handle absolute URLs
    if (path.startsWith("http")) {
        // If the path contains /uploads/, we force it to use the current API origin
        // This fixes issues where the DB has localhost/IP URLs but we're on a different domain
        if (path.includes("/uploads/")) {
            const relativePath = path.substring(path.indexOf("/uploads/"));
            return `${apiOrigin}${relativePath}`;
        }
        return path;
    }
    // Handle relative paths
    // Ensure we don't have double slashes
    return `${apiOrigin}/${path.replace(/^\/+/, "")}`;
}
}),
"[project]/app/(public)/blog/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogPostPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_27d3faa9b1a9d8cd0e1872aee1c051b9/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$blog$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/blog-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$public$292f$blog$2f5b$slug$5d2f$BlogPostClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(public)/blog/[slug]/BlogPostClient.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seo$2f$JsonLd$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seo/JsonLd.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
;
async function generateMetadata({ params }, parent) {
    const { slug } = await params;
    // Default metadata
    const defaultTitle = "Blog Post | Kofi Benteh Afful";
    const defaultDesc = "Read the latest news and updates from Hon. Kofi Benteh Afful.";
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$blog$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["blogService"].getPostBySlug(slug);
        if (response.success && response.data.post) {
            const post = response.data.post;
            const previousImages = (await parent).openGraph?.images || [];
            return {
                title: post.title,
                description: post.excerpt || defaultDesc,
                openGraph: {
                    title: post.title,
                    description: post.excerpt || defaultDesc,
                    images: post.image ? [
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getImageUrl"])(post.image),
                        ...previousImages
                    ] : previousImages,
                    type: "article",
                    siteName: "Hon. Kofi Benteh Afful - Office of the MP",
                    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kofibentehafful.com'}/blog/${slug}`,
                    publishedTime: post.published_at,
                    modifiedTime: post.published_at,
                    authors: post.author ? [
                        post.author
                    ] : [
                        "Hon. Kofi Benteh Afful"
                    ],
                    tags: Array.isArray(post.tags) ? post.tags : typeof post.tags === 'string' ? JSON.parse(post.tags) : [],
                    locale: "en_GH"
                },
                twitter: {
                    card: "summary_large_image",
                    title: post.title,
                    description: post.excerpt || defaultDesc,
                    images: post.image ? [
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getImageUrl"])(post.image)
                    ] : undefined,
                    site: "@KofiBentehAfful",
                    creator: post.author ? `@${post.author.replace(/\s+/g, '')}` : "@KofiBentehAfful"
                }
            };
        }
    } catch (error) {
        console.error("Failed to fetch blog post metadata:", error);
    }
    return {
        title: defaultTitle,
        description: defaultDesc
    };
}
async function BlogPostPage({ params }) {
    const { slug } = await params;
    let initialPost = null;
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$blog$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["blogService"].getPostBySlug(slug);
        if (response.success && response.data.post) {
            initialPost = response.data.post;
        }
    } catch (error) {
        console.error("Failed to fetch blog post for rendering:", error);
    }
    const jsonLd = initialPost ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": initialPost.title,
        "image": initialPost.image ? [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getImageUrl"])(initialPost.image)
        ] : [],
        "datePublished": initialPost.published_at,
        "dateModified": initialPost.published_at,
        "author": {
            "@type": "Person",
            "name": initialPost.author || "Kofi Benteh Afful"
        }
    } : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            jsonLd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seo$2f$JsonLd$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                data: jsonLd
            }, void 0, false, {
                fileName: "[project]/app/(public)/blog/[slug]/page.tsx",
                lineNumber: 93,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_27d3faa9b1a9d8cd0e1872aee1c051b9$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$public$292f$blog$2f5b$slug$5d2f$BlogPostClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                slug: slug,
                initialPost: initialPost
            }, void 0, false, {
                fileName: "[project]/app/(public)/blog/[slug]/page.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/app/(public)/blog/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(public)/blog/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__36818710._.js.map