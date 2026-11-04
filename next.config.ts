import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los videos de portada se envían mediante una Server Action.
  // El archivo se valida en el servidor con un máximo de 25 MB;
  // el MB adicional permite incluir los campos del formulario.
  experimental: {
    serverActions: {
      bodySizeLimit: '26mb',
    },
  },
};

export default nextConfig;
