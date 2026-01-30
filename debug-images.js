const { eventsService } = require("./lib/services/events-service");
const { heroSlidesService } = require("./lib/services/carousel-service");
const { blogService } = require("./lib/services/blog-service");

async function debugImages() {
  try {
    console.log("Fetching Blog Posts...");
    const blogRes = await blogService.getPosts();
    if (blogRes.success && blogRes.data.posts.length > 0) {
      console.log("Blog Post Image Example:", blogRes.data.posts[0].image);
    } else {
      console.log("No blog posts found or failed.");
    }

    console.log("\nFetching Events...");
    const eventsRes = await eventsService.getAdminEvents();
    if (eventsRes.success && eventsRes.data.events.length > 0) {
      // Find an event that should have an image
      const eventWithImage = eventsRes.data.events.find((e) => e.image);
      console.log(
        "Event Image Example:",
        eventWithImage ? eventWithImage.image : "No event has an image",
      );
      if (!eventWithImage && eventsRes.data.events.length > 0) {
        console.log(
          "First Event Raw Image field:",
          eventsRes.data.events[0].image,
        );
      }
    } else {
      console.log("No events found or failed.", eventsRes);
    }

    console.log("\nFetching Carousel Slides...");
    const slidesRes = await heroSlidesService.getAllSlides();
    if (slidesRes.success && slidesRes.data.slides.length > 0) {
      console.log("Slide Image Example:", slidesRes.data.slides[0].image);
    } else {
      console.log("No slides found or failed.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

debugImages();
