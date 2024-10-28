import { useEffect } from "react";

import { CapabilityMethodsItem } from "api/api.schemas";
import { useGetCapabilities } from "api/capabilities/capabilities";
import type { Endpoint } from "types/api";
import { logger } from "utils";

export enum CapabilityAction {
  READ = CapabilityMethodsItem.GET,
  CREATE = CapabilityMethodsItem.POST,
  DELETE = CapabilityMethodsItem.DELETE,
  UPDATE = CapabilityMethodsItem.PUT,
  RELATE = CapabilityMethodsItem.PATCH,
}

export const useGetCapabilityActions = (endpoint: Endpoint) => {
  const { data, isFetching, isError, error, refetch } = useGetCapabilities(
    // Capabilities should persist for the entire user session.
    { query: { gcTime: Infinity, staleTime: Infinity } },
  );

  useEffect(() => {
    if (error) {
      logger.error("Unable to fetch capabilities.", error);
    }
  }, [error]);

  //   const caps: Capability[] = [
  //     {
  //       endpoint: "/swagger.json",
  //       methods: ["GET"],
  //     },
  //     {
  //       endpoint: "/capabilities",
  //       methods: ["GET"],
  //     },
  //     {
  //       endpoint: "/identities",
  //       methods: ["GET", "POST"],
  //     },
  //     {
  //       endpoint: "/identities/{id}",
  //       methods: ["GET"],
  //     },
  //     {
  //       endpoint: "/identities/{id}/groups",
  //       methods: ["GET", "PATCH"],
  //     },
  //     {
  //       endpoint: "/identities/{id}/entitlements",
  //       methods: ["GET", "PATCH"],
  //     },
  //     {
  //       endpoint: "/groups",
  //       methods: ["GET", "POST"],
  //     },
  //     {
  //       endpoint: "/groups/{id}",
  //       methods: ["GET", "PUT", "DELETE"],
  //     },
  //     {
  //       endpoint: "/groups/{id}/identities",
  //       methods: ["GET", "PATCH"],
  //     },
  //     {
  //       endpoint: "/groups/{id}/entitlements",
  //       methods: ["GET", "PATCH"],
  //     },
  //     {
  //       endpoint: "/entitlements",
  //       methods: ["GET"],
  //     },
  //     {
  //       endpoint: "/entitlements/raw",
  //       methods: ["GET"],
  //     },
  //     {
  //       endpoint: "/resources",
  //       methods: ["GET"],
  //     },
  //   ] as Capability[];

  return {
    actions:
      //   caps
      data?.data.data
        .find((capability) => capability.endpoint === endpoint)
        ?.methods.map((method) =>
          Object.values<string>(CapabilityAction).find(
            (action) => action === method,
          ),
        ) ?? [],
    isFetching,
    isError,
    error,
    refetch,
  };
};

export const useCheckCapability = (
  endpoint: Endpoint,
  action: CapabilityAction,
) => {
  const { actions, isFetching, isError, error, refetch } =
    useGetCapabilityActions(endpoint);
  return {
    hasCapability: actions?.includes(action) ?? false,
    isFetching,
    isError,
    error,
    refetch,
  };
};
