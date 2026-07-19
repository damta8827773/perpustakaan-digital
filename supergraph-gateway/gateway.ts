// Apollo GraphQL Federation gateway: menggabungkan seluruh microservices
// menjadi satu endpoint. Bahasa: TypeScript.
export const SUBGRAPHS = [
  { name: "catalog", url: "http://catalog-legacy-bridge:8080/graphql" },
  { name: "identity", url: "http://identity-access-mgmt:8081/graphql" },
  { name: "analytics", url: "http://high-frequency-analytics:8082/graphql" },
];
