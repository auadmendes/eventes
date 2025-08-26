import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.istockphoto.com", // iStock
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com", 
      },
      {
        protocol: "https",
        hostname: "images.sympla.com.br", 
      },
      {
        protocol: "https",
        hostname: "assets.bileto.sympla.com.br", 
      },
      {
        protocol: "https",
        hostname: "patrickribeiro.com.br", 
      },
      {
        protocol: "https",
        hostname: "mapa.cultura.es.gov.br", 
      },
      {
        protocol: "https",
        hostname: "www.craes.org.br", 
      },
      {
        protocol: "https",
        hostname: "cdn.beacons.ai", 
      },
      {
        protocol: "https",
        hostname: "www.es.senac.br", 
      },
      {
        protocol: "https",
        hostname: "lebillet.com.br", 
      },
      {
        protocol: "https",
        hostname: "www.eventim.com.br", 
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com", 
      },
    ],
  },
};

export default nextConfig;
