export interface ServerConfig {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export const serverConfigs: ServerConfig[] = [
  {
    id: 'aidbox',
    name: 'Aidbox',
    url: 'https://niquola77.edge.aidbox.app/fhir',
    description: 'Standard FHIR server with SQL on FHIR support'
  },
  {
    id: 'helios',
    name: 'Helios Software',
    url: 'https://sof.heliossoftware.com',
    description: 'Supports direct resource processing via $run operation'
  }
];

export function getServerConfig(id: string): ServerConfig | undefined {
  return serverConfigs.find(config => config.id === id);
}

export function getServerConfigByUrl(url: string): ServerConfig | undefined {
  return serverConfigs.find(config => config.url === url);
}