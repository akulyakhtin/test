import { Eureka } from 'eureka-js-client';

let client: Eureka | null = null;

export function setEurekaClient(c: Eureka): void {
  client = c;
}

export function getEurekaClient(): Eureka | null {
  return client;
}
