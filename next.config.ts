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
      {
        protocol: "https",
        hostname: "yata-apix-b6a73c78-1100-48ad-9374-0a41af79d029.s3-object.locaweb.com.br", 
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", 
      },
      {
        protocol: "https",
        hostname: "www.steffencentrodeeventos.com.br", 
      },
      {
        protocol: "https",
        hostname: "placehold.co", 
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", 
      },
      {
        protocol: "https",
        hostname: "vale.com", 
      },
      {
        protocol: "https",
        hostname: "scontent-gig4-2.xx.fbcdn.net", 
      },
      {
        protocol: "https",
        hostname: "scontent-gig4-1.xx.fbcdn.net", 
      },
      {
        protocol: "https",
        hostname: "scontent-gru1-2.xx.fbcdn.net", 
      },
      {
        protocol: "https",
        hostname: "scontent-gig4-1.cdninstagram.com", 
      },
      {
        protocol: "https",
        hostname: "sesc-es.com.br", 
      },
      {
        protocol: "https",
        hostname: "shoppingvilavelha.com.br", 
      },
      {
        protocol: "https",
        hostname: "www.boulevardvilavelha.com.br", 
      },
    ],
  },
};

export default nextConfig;
