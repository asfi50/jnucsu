import { config } from "@/config";
import { Department, Position, Panel } from "@/context/data-context";
import { Category } from "@/lib/types";

interface ServerData {
  positions: Position[];
  departments: Department[];
  categories: Category[];
  panels: Panel[];
}

/**
 * Fetch positions and departments on the server side
 * This data is typically static and can be cached
 */
export async function fetchServerSideData(): Promise<ServerData> {
  try {
    // Fetch positions and departments in parallel with timeout
    const fetchWithTimeout = (
      url: string,
      options: RequestInit,
      timeout = 5000
    ) => {
      return Promise.race([
        fetch(url, options),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), timeout)
        ),
      ]);
    };

    const [
      positionsResponse,
      departmentsResponse,
      categoriesResponse,
      panelsResponse,
    ] = await Promise.allSettled([
      fetchWithTimeout(
        `${config.serverBaseUrl}/items/positions?sort=order&fields=id,name,order,allocated_slots`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          // Cache for 5 minutes to improve performance
          next: { revalidate: 300 },
        }
      ),
      fetchWithTimeout(`${config.serverBaseUrl}/items/department`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        // Cache for 5 minutes to improve performance
        next: { revalidate: 300 },
      }),
      fetchWithTimeout(
        `${config.serverBaseUrl}/items/category?fields=id,text`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          // Cache for 5 minutes to improve performance
          next: { revalidate: 300 },
        }
      ),
      fetchWithTimeout(
        `${config.serverBaseUrl}/items/panel?fields=id,name&filter[status][_eq]=published`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          // Cache for 5 minutes to improve performance
          next: { revalidate: 300 },
        }
      ),
    ]);

    let positions: Position[] = [];
    let departments: Department[] = [];
    let categories: Category[] = [];
    let panels: Panel[] = [];

    // Process positions response
    if (
      positionsResponse.status === "fulfilled" &&
      positionsResponse.value.ok
    ) {
      try {
        const positionsData = await positionsResponse.value.json();
        positions = positionsData.data || [];
      } catch (error) {
        console.error("Error parsing positions data:", error);
      }
    } else {
      console.error(
        "Failed to fetch positions:",
        positionsResponse.status === "rejected"
          ? positionsResponse.reason
          : positionsResponse.value.status
      );
    }

    // Process departments response
    if (
      departmentsResponse.status === "fulfilled" &&
      departmentsResponse.value.ok
    ) {
      try {
        const departmentsData = await departmentsResponse.value.json();
        departments = departmentsData.data || [];
      } catch (error) {
        console.error("Error parsing departments data:", error);
      }
    } else {
      console.error(
        "Failed to fetch departments:",
        departmentsResponse.status === "rejected"
          ? departmentsResponse.reason
          : departmentsResponse.value.status
      );
    }

    // Process categories response
    if (
      categoriesResponse.status === "fulfilled" &&
      categoriesResponse.value.ok
    ) {
      try {
        const categoriesData = await categoriesResponse.value.json();
        categories = categoriesData.data || [];
      } catch (error) {
        console.error("Error parsing categories data:", error);
      }
    } else {
      console.error(
        "Failed to fetch categories:",
        categoriesResponse.status === "rejected"
          ? categoriesResponse.reason
          : categoriesResponse.value.status
      );
    }

    // Process panels response
    if (panelsResponse.status === "fulfilled" && panelsResponse.value.ok) {
      try {
        const panelsData = await panelsResponse.value.json();
        panels = panelsData.data || [];
      } catch (error) {
        console.error("Error parsing panels data:", error);
      }
    } else {
      console.error(
        "Failed to fetch panels:",
        panelsResponse.status === "rejected"
          ? panelsResponse.reason
          : panelsResponse.value.status
      );
    }

    return {
      positions,
      departments,
      categories,
      panels,
    };
  } catch (error) {
    console.error("Error fetching server-side data:", error);
    // Return empty arrays as fallback
    return {
      positions: [],
      departments: [],
      categories: [],
      panels: [],
    };
  }
}

/**
 * Fallback function to fetch data client-side if server-side fetch fails
 */
export async function fetchClientSideData(): Promise<ServerData> {
  try {
    const [
      positionsResponse,
      departmentsResponse,
      categoriesResponse,
      panelsResponse,
    ] = await Promise.all([
      fetch("/api/positions"),
      fetch("/api/departments"),
      fetch("/api/categories"),
      fetch("/api/panel"),
    ]);

    let positions: Position[] = [];
    let departments: Department[] = [];
    let categories: Category[] = [];
    let panels: Panel[] = [];

    if (positionsResponse.ok) {
      positions = await positionsResponse.json();
    }

    if (departmentsResponse.ok) {
      departments = await departmentsResponse.json();
    }

    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    }

    if (panelsResponse.ok) {
      panels = await panelsResponse.json();
    }

    return {
      positions,
      departments,
      categories,
      panels,
    };
  } catch (error) {
    console.error("Error fetching client-side data:", error);
    return {
      positions: [],
      departments: [],
      categories: [],
      panels: [],
    };
  }
}
