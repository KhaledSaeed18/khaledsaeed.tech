import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Khaled Saeed | Software Engineer",
        short_name: "Khaled Saeed",
        description:
            "Portfolio of Khaled Saeed, a software engineer specializing in web development and open-source projects.",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
    };
}
